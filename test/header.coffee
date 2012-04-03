
# Test CSV - Copyright David Worms <open@adaltas.com> (BSD Licensed)

fs = require 'fs'
should = require 'should'
csv = require '..'

describe 'header', ->
        it 'should print headers with defined write columns', (next) ->
            csv()
            .fromPath("#{__dirname}/header/defwcols.in")
            .toPath("#{__dirname}/header/defwcols.tmp",
                header: true
                columns: ["FIELD_1", "FIELD_2"]
            )
            .on 'end', (count) ->
                count.should.eql 2
                expect = fs.readFileSync("#{__dirname}/header/defwcols.out").toString()
                result = fs.readFileSync("#{__dirname}/header/defwcols.tmp").toString()
                result.should.eql expect
                fs.unlink "#{__dirname}/header/defwcols.tmp"
                next()
        it 'should print headers with true read columns and defined write columns', (next) ->
            csv()
            .fromPath("#{__dirname}/header/truercols_defwcols.in",
                columns: true
            )
            .toPath("#{__dirname}/header/truercols_defwcols.tmp",
                header: true
                columns: ["FIELD_1", "FIELD_2"]
            )
            .on 'end', (count) ->
                count.should.eql 2
                expect = fs.readFileSync("#{__dirname}/header/truercols_defwcols.out").toString()
                result = fs.readFileSync("#{__dirname}/header/truercols_defwcols.tmp").toString()
                result.should.eql expect
                fs.unlink "#{__dirname}/header/truercols_defwcols.tmp"
                next()





