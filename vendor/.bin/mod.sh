#!/bin/bash

#基本参数
bin_dir=`dirname $(pwd)/${0}`
app_dir="${bin_dir}/.."
mod_dir="${app_dir}/src/submodules"
conf_file="${mod_dir}/modules.config"

if [[ ! -d $mod_dir ]]; then
  echo "错误：模块目录不存在，请进行检查，确认是否误删"
  exit
fi

if [[ ! -f $conf_file ]]; then
  echo "错误：配置文件不存在，无法加载模块, 请确认是否误删"
  exit
fi

if [[ ! -s $conf_file ]]; then
  echo "提示：模块文件为空，请在配置中，添加需要加载的模块"
  ls ${app_dir}/..
  exit
fi

echo "模块配置开始"
cd ${app_dir}

cat $conf_file | while read module
do
    echo "--加载模块: ${module}"
    if [[ ! -d "${mod_dir}/${module}" ]]; then
      echo "--创建目录"
      ln -s "${app_dir}/../${module}" "${mod_dir}/${module}"
    else
      echo "--目录已创建"
    fi

    echo "--更新模块: ${module}"
    cd "${mod_dir}/${module}"
    git checkout master && git pull
    git checkout develop && git pull

    cd ${app_dir}

done

echo "模块配置结束"
