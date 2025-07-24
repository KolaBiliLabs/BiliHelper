import { ref } from 'vue'

interface EditData {
  id: string
  name: string
  desc: string
}

const isShowModal = ref(false)
const isEdit = ref(false)
const editData = ref<EditData | null>(null)

function openModal(edit = false, data: any = null) {
  isShowModal.value = true
  isEdit.value = edit
  editData.value = data
}

function closeModal() {
  isShowModal.value = false
  isEdit.value = false
  editData.value = null
}

export function useCreatePlaylistModal() {
  return {
    isShowModal,
    isEdit,
    editData,
    openModal,
    closeModal,
  }
}
