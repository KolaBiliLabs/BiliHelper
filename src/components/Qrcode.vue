<script lang="ts" setup>
import { NButton, NQrCode } from 'naive-ui'
import { storeToRefs } from 'pinia'
import QS from 'qs'
import { onUnmounted, ref } from 'vue'
import { getLoginUrlApi, verifyQrCodeApi } from '@/api/bilibili'
import { useUserStore } from '@/stores/userStore'
import { ELoginState, EQRCodeState } from '@/utils/enums'

const emit = defineEmits<{
  success: []
}>()

const userStore = useUserStore()
const { currentUser } = storeToRefs(userStore)

const qrCodeImage = ref<string>()

const loginState = ref(ELoginState.未登录)

let timer: NodeJS.Timeout | null = null
// 获取登录链接，生成二维码
async function getQRCode() {
  loginState.value = 0
  qrCodeImage.value = ''

  const { data } = await getLoginUrlApi()
  if (!data) {
    timer = setTimeout(getQRCode, 1000 * 3)
    return
  }

  const { qrcode_key, url } = data

  qrCodeImage.value = url
  verifyQrCode(qrcode_key)
}

// 验证扫码信息
async function verifyQrCode(qrcode_key: string) {
  const { data } = await verifyQrCodeApi(qrcode_key)

  if (!data) {
    timer = setTimeout(() => verifyQrCode(qrcode_key), 1000 * 3)

    return
  }

  switch (data.code) {
    case EQRCodeState.已失效: {
      loginState.value = ELoginState.已过期
      break
    }
    case EQRCodeState.未扫码: {
      timer = setTimeout(() => verifyQrCode(qrcode_key), 1000 * 3)
      break
    }
    case EQRCodeState.已扫码未确认:{
      loginState.value = ELoginState.已扫码
      timer = setTimeout(() => verifyQrCode(qrcode_key), 1000 * 3)
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

  qrCodeImage.value = ''
  loginState.value = ELoginState.未登录
  emit('success')
}

onUnmounted(() => {
  if (timer) {
    clearTimeout(timer)
    timer = null
  }
})

getQRCode()
</script>

<template>
  <div class="size-40 flex-center">
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
    <NQrCode
      v-else
      :value="qrCodeImage"
      type="canvas"
      class="size-40!"
      :size="138"
    />
  </div>
</template>
