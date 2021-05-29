export function loadUrlAsImage(url: string): Promise<HTMLImageElement> {
  return new Promise((res, rej) => {
    const img = document.createElement('img');
    img.src = url;
    img.onload = () => res(img);
    img.onerror = () => rej(img);
    // a bit different approach ->
    // var _img = document.getElementById('id1');
    // var newImg = new Image;
    // newImg.onload = function() {
    //   _img.src = this.src;
    // }
    // newImg.src = 'http://whatever';
  });
}

export async function loadMediaSource(url: string): Promise<Blob> {
  // todo: check buffer by ID
  const response = await fetch(url);
  // todo: invalidate first bytes from buffer
  const mediaSourceBuffer = await response.arrayBuffer();
  // todo: save this mediaSource into buffer
  // load image into the page
  return new Blob([mediaSourceBuffer]);
}

export function blobToHTMLImageElement(blob: Blob): Promise<HTMLImageElement> {
  return new Promise((resolve) => {
    const imageObjectURL = window.URL.createObjectURL(blob);
    const imageElement = new Image();
    imageElement.setAttribute('src', imageObjectURL);
    imageElement.onload = () => {
      // the Blob can be Garbage Collected
      URL.revokeObjectURL(imageObjectURL);
      resolve(imageElement);
    };
  });
}

// export interface IImageSize {
//   width: number;
//   height: number;
// }
//
// export function getRemoteImageSize(url: string): Promise<IImageSize> {
//   return new Promise((res) => {
//     const img = new Image();
//     img.setAttribute('crossOrigin', 'anonymous');
//
//     img.addEventListener('load', function () {
//       res({ width: this.naturalWidth, height: this.naturalHeight });
//     });
//
//     img.addEventListener('error', function () {
//       throw new Error('Image request failed');
//     });
//
//     img.src = url;
//   });
// }
