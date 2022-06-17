<template>
  <div class="FC JC AC home height100">
    <div
      v-if="!loading"
      class="C87 abs FC JC AC"
      style="margin-bottom: 40px; top: 30px"
    >
      <h1 style="margin-bottom: 20px">png, jpg, jpeg를 webp로!</h1>
      <h1>폴더 또는 파일에다가 드래그 드랍!</h1>
    </div>
    <div v-if="loading" class="FC JC AC img-box">
      <img :src="require(`@/assets/loading.png`)" />
      <h1 class="C87">바꾸는 중!</h1>
      <h1 class="C87">프로그램 끄면 바뀌다 맙니다잉~</h1>
    </div>
    <div v-else-if="showResult && !result" class="FC JC AC img-box">
      <img :src="require(`@/assets/fail.png`)" />
      <h1 class="C87">실패했다우,,,</h1>
    </div>
    <div v-else-if="showResult && result" class="FC JC AC img-box">
      <img :src="require(`@/assets/success.png`)" />
      <h1 class="C87">성공했다우!</h1>
    </div>

    <div v-else class="FC AC JC">
      <div class="FR AC JC">
        <div class="FC AC JC drag pointer" id="drag-folder">
          <h2 class="C87">Folder</h2>
        </div>
        <div class="FC AC JC drag pointer" id="drag-file">
          <h2 class="C87">File</h2>
        </div>
      </div>
      <div class="FR AC width100" style="margin-top: 20px; margin-left: 20px">
        <h3 style="margin-right: 20px" class="C87">어느 크기로 조절??</h3>
        <input type="range" min="30" max="1000" step="5" v-model="size" />
        <h3 class="C87">{{ size }} X {{ size }}</h3>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue } from "vue-class-component";
const { ipcRenderer } = window.require("electron");
export default class ImageConverter extends Vue {
  loading = false;
  showResult = false;
  result = true;
  size = 60;

  dragFolderElement: any = null;
  dragFileElement: any = null;

  folderHandler() {
    this.dragFileElement = null;
    this.dragFolderElement = document.getElementById("drag-folder");
    this.dragFolderElement.ondragover = () => {
      return false;
    };
    this.dragFolderElement.ondragleave = () => {
      return false;
    };
    this.dragFolderElement.ondragend = () => {
      return false;
    };
    this.dragFolderElement.ondrop = async (e: any) => {
      e.preventDefault();
      this.loading = true;
      const rootFilePath = e.dataTransfer.files[0]?.path;
      this.result = await ipcRenderer.invoke("convertFolderImage", {
        path: rootFilePath,
        size: this.size,
      });
      this.showResult = true;
      this.loading = false;
      setTimeout(() => {
        this.showResult = false;
        setTimeout(() => {
          this.folderHandler();
          this.fileHandler();
        }, 0);
      }, 5000);
      return;
    };
  }

  fileHandler() {
    this.dragFileElement = null;
    this.dragFileElement = document.getElementById("drag-file");
    this.dragFileElement.ondragover = () => {
      return false;
    };
    this.dragFileElement.ondragleave = () => {
      return false;
    };
    this.dragFileElement.ondragend = () => {
      return false;
    };
    this.dragFileElement.ondrop = async (e: any) => {
      e.preventDefault();
      this.loading = true;
      const rootFilePath = e.dataTransfer.files[0]?.path;
      this.result = await ipcRenderer.invoke("convertImage", {
        path: rootFilePath,
        size: this.size,
      });
      this.showResult = true;
      this.loading = false;
      setTimeout(() => {
        this.showResult = false;
        setTimeout(() => {
          this.folderHandler();
          this.fileHandler();
        }, 0);
      }, 5000);

      return false;
    };
  }

  mounted() {
    this.folderHandler();
    this.fileHandler();
  }
}
</script>

<style scoped>
.home {
  background: #c83001;
}
input[type="range"] {
  -webkit-appearance: none;
  margin-right: 15px;
  width: 200px;
  height: 7px;
  background: rgba(255, 255, 255, 0.6);
  border-radius: 5px;
  cursor: pointer;
  background-size: 70% 100%;
  background-repeat: no-repeat;
}
input[type="range"]::-webkit-slider-thumb {
  -webkit-appearance: none;
  height: 20px;
  width: 20px;
  border-radius: 50%;
  background: #ff4500;
  cursor: pointer;
  box-shadow: 0 0 2px 0 #555;
  transition: background 0.3s ease-in-out;
}
/* input[type="range"]::-webkit-slider-runnable-track {
  -webkit-appearance: none;
  box-shadow: none;
  border: none;
  background: transparent;
} */
.img-box {
  height: 240px;
}
.drag {
  border: 2px dashed #fff;
  height: 150px;
  width: 350px;
  border-radius: 5px;
  margin-left: 10px;
  margin-right: 10px;
}
.drag.active {
  border: 2px solid #fff;
}
.drag .icon {
  font-size: 100px;
  color: #fff;
}
.drag header {
  font-size: 30px;
  font-weight: 500;
  color: #fff;
}
.drag span {
  font-size: 25px;
  font-weight: 500;
  color: #fff;
  margin: 10px 0 15px 0;
}
.drag button {
  padding: 10px 25px;
  font-size: 20px;
  font-weight: 500;
  border: none;
  outline: none;
  background: #fff;
  color: #5256ad;
  border-radius: 5px;
  cursor: pointer;
}
.drag img {
  height: 100%;
  width: 100%;
  object-fit: cover;
  border-radius: 5px;
}
</style>
