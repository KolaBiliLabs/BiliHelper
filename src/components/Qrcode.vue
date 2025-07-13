<script lang="ts" setup>
import { NButton } from 'naive-ui'
import { storeToRefs } from 'pinia'
import QRCode from 'qrcode'
import QS from 'qs'
import { onMounted, ref } from 'vue'
import { getLoginUrlApi, verifyQrCodeApi } from '@/api/bilibili'
import { useAppStore } from '@/stores/appStore'
import { ELoginState, EQRCodeState } from '@/utils/enums'

const emit = defineEmits<{
  success: []
}>()

const { currentUser } = storeToRefs(useAppStore())

const qrCodeImage = ref<string>()

const loginState = ref(ELoginState.未登录)

// 获取登录链接，生成二维码
async function getQRCode() {
  loginState.value = 0
  qrCodeImage.value = ''

  const { data } = await getLoginUrlApi()
  if (!data) {
    setTimeout(getQRCode, 1000 * 3)
    return
  }

  const { qrcode_key, url } = data

  qrCodeImage.value = await QRCode.toDataURL(url)
  verifyQrCode(qrcode_key)
}

// 验证扫码信息
async function verifyQrCode(qrcode_key: string) {
  const { data } = await verifyQrCodeApi(qrcode_key)

  if (!data) {
    setTimeout(() => verifyQrCode(qrcode_key), 1000 * 3)

    return
  }

  switch (data.code) {
    case EQRCodeState.已失效: {
      loginState.value = ELoginState.已过期
      break
    }
    case EQRCodeState.未扫码: {
      setTimeout(() => verifyQrCode(qrcode_key), 1000 * 3)
      break
    }
    case EQRCodeState.已扫码未确认:{
      loginState.value = ELoginState.已扫码
      setTimeout(() => verifyQrCode(qrcode_key), 1000 * 3)
      break
    }
    case EQRCodeState.成功登陆: {
      loginState.value = ELoginState.扫码登陆成功
      saveLoginInfo(data.url)
      break
    }
    default: {
      break
    }
  }
}

// 解析数据
async function saveLoginInfo(url: string) {
  const { DedeUserID, bili_jct, SESSDATA } = QS.parse(url.split('?')[1])

  const data: IAccess = {
    uid: +DedeUserID!.toString(),
    cookie: `SESSDATA=${SESSDATA}`,
    csrf: bili_jct!.toString(),
  }

  setUserInfo(data)
}

// 写入用户信息
async function setUserInfo(access: IAccess) {
  const user: IUser = {
    uname: '新的用户',
    mid: access.uid,
    face: 'vite.svg',
    csrf: access.csrf,
    cookie: access.cookie,
    medalCount: 0,
    medals: [],
    wbi_img: {
      img_url: '',
      sub_url: '',
    },
  }

  currentUser.value = user

  // 我在这里打印一下，
  console.log('🚀 ~ setUserInfo ~ currentUser:', currentUser, currentUser.value.cookie)

  qrCodeImage.value = ''
  loginState.value = ELoginState.未登录
  emit('success')
}

onMounted(getQRCode)
</script>

<template>
  <div class="size-40 center">
    <h5 v-if="loginState === ELoginState.已扫码">
      扫码成功
    </h5>
    <h5 v-else-if="loginState === ELoginState.已过期">
      二维码已过期
      <NButton :underline="false" @click="getQRCode">
        点击刷新
      </NButton>
    </h5>
    <h5 v-else-if="loginState === ELoginState.扫码登陆成功">
      登录成功
    </h5>
    <img v-else :src="qrCodeImage" class="h-full w-full">
  </div>
</template>
