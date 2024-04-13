// 이미지 사이즈를 줄이는 함수
const resizeImage = (file: File, scale: number): Promise<Blob> => {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.src = URL.createObjectURL(file) // 파일을 URL로 변환
    img.onload = () => {
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')
      if (!ctx) {
        reject(new Error('Canvas를 지원하지 않는 환경입니다.'))
        return
      }
      canvas.width = img.width * scale // 너비 조정
      canvas.height = img.height * scale // 높이 조정
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
      canvas.toBlob((blob) => {
        if (blob) {
          resolve(blob) // Blob이 성공적으로 생성된 경우
        } else {
          reject(new Error('Blob 생성에 실패했습니다.'))
        }
      }, file.type) // 파일의 MIME 타입을 유지
    }
    img.onerror = () => reject(new Error('이미지 로딩 실패'))
  })
}

export { resizeImage }
