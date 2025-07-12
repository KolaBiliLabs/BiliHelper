import { ref } from 'vue'

export function useLoginModal() {
  const isShowModal = ref(false)

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
