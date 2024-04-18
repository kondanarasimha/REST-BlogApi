const keyText = document.querySelector('.api-key').innerHTML;
    const copyButton = document.querySelector('.copy-button');
    copyButton.addEventListener('click',()=> {
      navigator.clipboard.writeText(keyText);
      if(copyButton.innerHTML === 'COPY') {
        copyButton.innerHTML = 'COPIED'
      }
    })