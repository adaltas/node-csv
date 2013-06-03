
fs = require 'fs'
mecano = require 'mecano'
each = require 'each'

date = -> d = (new Date).toISOString()

###
Find indentation based on the first line containing text
###
getindent = (text) ->
  text = text.split '\n' unless Array.isArray text
  # Find indentation based on the first line containing text
  for line in text
    if line.trim()
      return /(\s*)/.exec(line)[0]
  ''

###
Discover indentation in first line and remove it for every other lines
###
unindent = (lines) ->
  lines = lines.split('\n')
  indent = getindent lines
  # for line in lines
  #   if line.trim()
  #     indent = /(\s*)/.exec(line)[0]
  #     break
  # Remove indentation
  lines = lines.map (line) ->
    line.substr indent.length
  lines.join('\n')

###
Create an anchor from the function name in the title
###
convert_anchor = (text) ->
  re_anchor = /`([\w.]+)\(/g
  text.replace re_anchor, (str, code) ->
    # At least in FF, <a href="" /> doesn't close the tag
    "<a name=\"#{code}\"></a>\n`#{code}("

convert_code = (text) ->
  re_code = /\n(\s{4}\s*?\S[\s\S]*?)\n(?!\s)/g
  text.replace re_code, (str, code) ->
    code = code.split('\n').map((line)->line.substr(4)).join('\n')
    "\n\n```javascript\n#{code}\n```\n\n"

docs = ['index', 'from', 'to', 'transformer', 'parser', 'stringifier']

each( docs )
.parallel( true )
.on 'item', (file, next) ->
  source = "#{__dirname}/#{file}.coffee"
  destination = "#{__dirname}/../doc/#{file}.md"
  fs.readFile source, 'ascii', (err, text) ->
    return console.error err if err
    re = /###(.*)\n([\s\S]*?)\n( *)###/g
    re_title = /([\s\S]+)\n={2}=+([\s\S]*)/g
    match = re.exec text
    match = re_title.exec match[2]
    title = match[1].trim()
    content = match[2]
    content = unindent content
    content = convert_code content
    docs = """
    ---
    language: en
    layout: page
    title: "#{title}"
    date: #{date()}
    comments: false
    sharing: false
    footer: false
    navigation: csv
    github: https://github.com/wdavidw/node-csv
    ---
    #{content}
    """
    while match = re.exec text
      continue if match[1]
      match[2] = unindent match[2]
      docs += convert_code convert_anchor match[2]
      docs += '\n'
    fs.writeFile destination, docs, next
.on 'both', (err) ->
  return console.error err if err
  console.log 'Documentation generated'
  destination = process.argv[2]
  return unless destination
  each()
  .files("#{__dirname}/../doc/*.md")
  .on 'item', (file, next) ->
    mecano.copy
      source: file
      destination: destination
      force: true
    , next
  .on 'both', (err) ->
    return console.error err if err
    console.log "Documentation published: #{destination}"

