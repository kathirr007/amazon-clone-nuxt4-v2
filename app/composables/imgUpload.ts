// export default {
//   data() {
//     return {
//       images: {},
//       image: [],
//     }
//   },
//   computed: {

//   },
//   methods: {
//     imagesAdd(e) {
//       this.uploadedFiles = []
//       if(this.product) {
//         this.product.photo = ''
//       }
//       // debugger
//       var files = e.target.files || e.dataTransfer.files;

//       this.images = [];
//       this.image = [];
//       Array.prototype.push.apply(this.images, files);
//       if (!this.images.length)
//         return;

//       this.createImage(this.images);

//     },

//     createImage(file) {
//         for (var i = 0; i < file.length; i++) {
//           if (/\.(jpg|webp|jpe?g|png|gif)$/i.test(file[i].name)) {
//             var reader = new FileReader();
//             var vm = this;

//             reader.onload = (e) => {
//               vm.image.push(e.target.result);
//               // console.log(vm.image);
//             };
//             reader.readAsDataURL(file[i]);
//           }
//         }
//     },
//     removeImage(key) {
//       this.image.splice(key, 1);
//       this.images.splice(key, 1);
//       /* if(this.$refs.prodImagesInput) {
//       } else if (this.$refs.prodImagesInput) {

//       } */
//       this.$refs.imagesInput.setFiles(this.images)

//       if (!this.image.length) {
//         this.$refs.imagesInput.setFiles()
//       }
//     },
//   }
// }

// useImageUpload.ts
import { ref } from 'vue'

export function useImageUpload() {
  const selectedImages = ref<File[]>([])
  const image = ref<string[]>([])
  const imagesInput = ref()

  const createImage = (files: File[]) => {
    files.forEach((file) => {
      // eslint-disable-next-line regexp/no-unused-capturing-group
      if (/\.(webp|jpe?g|png|gif)$/i.test(file.name)) {
        const reader = new FileReader()

        reader.onload = (e) => {
          if (e.target?.result) {
            image.value.push(e.target.result as string)
          }
        }

        reader.readAsDataURL(file)
      }
    })
  }

  const imagesAdd = (e: Event) => {
    const files = (e.target as HTMLInputElement).files || (e as DragEvent).dataTransfer?.files

    selectedImages.value = []
    image.value = []

    if (files) {
      Array.from(files).forEach((file) => {
        selectedImages.value.push(file)
      })
    }

    if (!selectedImages.value.length)
      return

    createImage(selectedImages.value)
  }

  function fileArrayToFileList(filesArray: File[]): FileList {
    const dt = new DataTransfer()
    filesArray.forEach(file => dt.items.add(file))
    return dt.files
  }

  const removeImage = (key: number) => {
    image.value.splice(key, 1)
    selectedImages.value.splice(key, 1)

    if (!image.value.length && imagesInput.value) {
      // imagesInput.value.setFiles()
      imagesInput.value.element.files = ''
    }

    if (imagesInput.value) {
      // imagesInput.value.setFiles(images.value)
      imagesInput.value.element.files = fileArrayToFileList(selectedImages.value)
    }
  }

  return {
    selectedImages,
    image,
    imagesInput,
    imagesAdd,
    removeImage,
  }
}
