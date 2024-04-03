// 이메일 도메인 선택
const mailSelect = () => {
	const selectElement = document.getElementById('emailSelect') as HTMLSelectElement;
	const inputElement = document.getElementById('emailInput') as HTMLInputElement;
	const selectedOption = selectElement.options[selectElement.selectedIndex].value;

	if (selectedOption === 'dInput') {
		selectElement.style.display = 'none';
		inputElement.style.display = 'block';
	} else {
		selectElement.style.display = 'block';
		inputElement.style.display = 'none';
	}
};

$(function () {
  // input focus
  $('.input__element').on('focus', function () {
    $(this).parents('.input__item').addClass('input--focus');
  });
  $('.input__element').on('blur', function () {
    $(this).parents('.input__item').removeClass('input--focus');
  });

  // input file image preview
  const imgTarget = $('.filepreview-type .input__element');
  imgTarget.on('change', function () {
    const parent = $(this).parent();
    const existingImage = parent.siblings('.item__display img');
    const displayImage = $('<img class="file-thumb">');

    parent.siblings('.item__display').find('img').remove();

    if (window.FileReader) {
      if (!$(this)[0].files || !$(this)[0].files[0].type.match(/image\//)) return;

      const reader = new FileReader();
      reader.onload = function (e) {
        const src = e.target?.result as string;
        displayImage.attr('src', src);
        parent.siblings('.item__display').prepend(displayImage);
      };
      reader.readAsDataURL($(this)[0].files[0]);
    } else {
      if (this.value === '') return;

      $(this)[0].select();
      $(this)[0].blur();
      const imgSrc = document.selection.createRange().text;
      displayImage[0].style.filter =
        "progid:DXImageTransform.Microsoft.AlphaImageLoader(enable='true',sizingMethod='scale',src=\"" +
        imgSrc +
        '")';
      parent.siblings('.item__display').prepend(displayImage);
    }

    // 이미지 업로드 후 재선택 가능하도록 input value 초기화
    $(this).val('');
  });

  // input file image delete
  $('.filepreview-type .button--del').on('click', function () {
    const imgTarget = $('.filepreview-type .input__element');
    imgTarget.val('');
    $('.item__display').find('img').remove();
  });
});
