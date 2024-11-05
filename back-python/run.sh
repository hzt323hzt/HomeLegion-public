#! /bin/bash
PYPATH=~/.py/bin/python3
l_flag=false
IPADDR="127.0.0.1"
# Loop through the arguments
for arg in "$@"
do
  if [ "$arg" = "-l" ]; then
    l_flag=true
    break
  fi
done
# Check if -l was provided
if $l_flag; then
    $PYPATH -m flask --app homelg run --host 0.0.0.0
else
    tar -zxvf front.tar
    sed -i "s/localhost:5000/${IPADDR}/g" front/static/js/*.*
    nohup $PYPATH -m flask --app homelg run &
fi

