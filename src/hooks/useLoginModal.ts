import { ref } from 'vue'

const isShowModal = ref(false)

export function useLoginModal() {
  function openModal() {
    isShowModal.value = true
  }

  function closeModal() {
    isShowModal.value = false
  }

  return {
    isShowModal,
    openModal,
    closeModal,
  }
}
