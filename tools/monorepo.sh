#!/bin/sh

repos=(
  https://github.com/adaltas/node-csv
  https://github.com/adaltas/node-csv-generate
  https://github.com/adaltas/node-csv-parse
  https://github.com/adaltas/node-csv-stringify
  https://github.com/adaltas/node-stream-transform
)
directory=packages

getPackageName () {
  splited=(${1//// })
  echo ${splited[${#splited[@]}-1]/node-/}
}

# Initialize
[ -d .git ] && exit 0
git init
echo 'new'

for repo in ${repos[@]}; do
  package=$(getPackageName $repo)
  git remote add -f $package $repo
  git pull --allow-unrelated-histories $package master

  mkdir -p $directory/$package

  # Move files
  files=$(find . -maxdepth 1 | egrep -v ^./tools$ | egrep -v ^./.git$ | egrep -v ^.$ | egrep -v ^./${directory}$)
  for file in ${files// /[@]}; do
    mv $file $directory/$package
  done
  git add .
  git commit -m "Move "$package" to "$directory/$package
done
