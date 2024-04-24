// 이메일 도메인 선택 로직
const mailSelect = () => {
  const selectElement = document.getElementById('emailSelect') as HTMLSelectElement
  const inputElement = document.getElementById('emailInput') as HTMLInputElement
  const selectedOption = selectElement.options[selectElement.selectedIndex].value

  if (selectedOption === 'dInput') {
    selectElement.style.display = 'none'
    inputElement.style.display = 'block'
  } else {
    selectElement.style.display = 'block'
    inputElement.style.display = 'none'
  }
}

document.addEventListener('DOMContentLoaded', function () {
  // Input focus 로직
  const inputElements = document.querySelectorAll('.input__element') as NodeListOf<HTMLInputElement>
  inputElements.forEach((input) => {
    input.addEventListener('focus', function () {
      this.closest('.input__item')?.classList.add('input--focus')
    })
    input.addEventListener('blur', function () {
      this.closest('.input__item')?.classList.remove('input--focus')
    })
  })

  // 이미지 미리보기 로직
  const imgTargets = document.querySelectorAll(
    '.filepreview-type .input__element'
  ) as NodeListOf<HTMLInputElement>
  imgTargets.forEach((imgTarget) => {
    imgTarget.addEventListener('change', function () {
      const parent = this.parentElement
      const existingImage = parent?.nextElementSibling?.querySelector('img')
      const displayImage = document.createElement('img')
      displayImage.className = 'file-thumb'

      parent?.nextElementSibling?.querySelector('img')?.remove()

      if (window.FileReader) {
        if (!this.files || !this.files[0].type.match(/image\//)) return

        const reader = new FileReader()
        reader.onload = function (e) {
          const src = e.target?.result as string
          displayImage.src = src
          parent?.nextElementSibling?.prepend(displayImage)
        }
        reader.readAsDataURL(this.files[0])
      } else {
        if (this.value === '') return

        window.getSelection()?.toString()
        displayImage.style.filter =
          "progid:DXImageTransform.Microsoft.AlphaImageLoader(enable='true',sizingMethod='scale',src=\"" +
          this.value +
          '")'
        parent?.nextElementSibling?.prepend(displayImage)
      }

      // 이미지 업로드 후 재선택 가능하도록 input value 초기화
      this.value = ''
    })
  })

  // 이미지 삭제 로직
  const delButtons = document.querySelectorAll('.filepreview-type .button--del')
  delButtons.forEach((button) => {
    button.addEventListener('click', function () {
      const imgTarget = document.querySelector(
        '.filepreview-type .input__element'
      ) as HTMLInputElement
      imgTarget.value = ''
      document.querySelector('.item__display')?.querySelector('img')?.remove()
    })
  })
})
