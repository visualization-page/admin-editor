#!/bin/bash

base="/home/shinemo/butterfly"
v_time=`date "+%Y-%m-%d %H:%M:%S"`
bakstr="[准备备份 butterfly server/public:]"${v_time}
logfile="${base}/butterfly_backup.log"

if [ ! -d $logfile  ];then
  touch $logfile
fi

echo >> $logfile
echo $bakstr >> $logfile

pathSrc="${base}/server/public"
#filesSrc=$(ls $pathSrc)

cd $pathSrc
zip -qr butterfly_backup.zip *
if [ $? -eq 0 ]; then
    echo "备份新的文件成功" >> $logfile
else
    echo "备份新的文件失败" >> $logfile
fi

echo "移动到根目录" >> $logfile
mv -f butterfly_backup.zip /

echo "[备份结束]" >> $logfile
