#!/bin/bash

#基本参数
bin_dir=`dirname $(pwd)/${0}`
app_dir="${bin_dir}/.."
develop_dir="${bin_dir}/develop"
release_dir="${bin_dir}/release"

#判断项目模式
lock_file="${bin_dir}/.lock"
bin_mode=`cat ${lock_file}`

#创建信号文件
if [[ ! -f $lock_file ]]; then
  touch $lock_file
fi

#判断当前已经设置的项目模式
if [[ ("$bin_mode" != "develop" && "$bin_mode" != "release") ]]; then
  rm -f $lock_file
  touch $lock_file
fi

#显示当前开发模式
if [[ "$1" = "mode" ]]; then
  echo "当前开发模式为${bin_mode}"
  exit
fi

if [[ ("$1" != "develop" && "$1" != "release")]];then
  echo "请输入当前项目设置模式"
  echo "开发模式: develop"
  echo "发布模式: release"

elif [[ "$1" = "develop" ]]; then

  if [[ "$bin_mode" = "develop" && ("$2" != "build") ]]; then
    echo "当前已设置为开发模式"
    exit 0
  else
    echo "正在设置开发模式"
    echo "develop" > $lock_file
  fi

  cd ${app_dir}

  echo "--更新配置文件"
  rm -f "${app_dir}/gulpfile.js"
  cp "${develop_dir}/gulpfile.js" "${app_dir}/gulpfile.js"

  if [[ "$2" = "build" ]]; then

    echo "--更新node_modules"
    rm -f "${app_dir}/node_modules/aoao-*"
    npm install --save git+ssh://git@github.com/o3cloud/aoao-core-api-service.git#develop
    npm install --save git+ssh://git@github.com/o3cloud/aoao-style-themes.git#develop
    npm install

    echo "--测试环境打包"
    rm -rf "${app_dir}/dist" && atool-build && gulp json-replace && gulp copy_img version_chunk && gulp clean-scripts
    exit

  else

    echo "--更新node_modules"
    rm -f "${app_dir}/node_modules/aoao-*"
    npm install --save ./src/submodules/aoao-core-api-service/
    npm install --save ./src/submodules/aoao-style-themes/
    npm install

  fi

elif [[ "$1" = "release" ]]; then

  if [[ "$bin_mode" = "release" ]]; then
    echo "当前已设置为发布模式"
    exit 0
  else
    echo "正在设置发布模式"
    echo "release" > $lock_file
  fi

  cd ${app_dir}

  echo "--更新配置文件"
  rm -f "${app_dir}/gulpfile.js"
  cp "${release_dir}/gulpfile.js" "${app_dir}/gulpfile.js"

  echo "--更新node_modules"
  rm -f "${app_dir}/node_modules/aoao-*"
  npm install --save git+ssh://git@github.com/o3cloud/aoao-core-api-service.git#develop
  npm install --save git+ssh://git@github.com/o3cloud/aoao-style-themes.git#develop
  npm install

fi
