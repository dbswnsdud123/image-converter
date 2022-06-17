"use strict";

import { app, protocol, BrowserWindow, ipcMain } from "electron";
import { createProtocol } from "vue-cli-plugin-electron-builder/lib";
import installExtension, { VUEJS3_DEVTOOLS } from "electron-devtools-installer";
import fs from "fs";
import sharp from "sharp";

const isDevelopment = process.env.NODE_ENV !== "production";
console.log(__dirname, "__dirname");
protocol.registerSchemesAsPrivileged([
  { scheme: "app", privileges: { secure: true, standard: true } },
]);

async function createWindow() {
  // Create the browser window.
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    resizable: false,
    webPreferences: {
      nodeIntegration: true,
      enableRemoteModule: true,
      contextIsolation: false,
    },
  });

  async function searchDirectory(path: string) {
    const files = await fs.readdirSync(path);
    let fileList: any = [];
    for (const file of files) {
      const isDirectory = fs.lstatSync(`${path}/${file}`).isDirectory();
      if (isDirectory) {
        const dirFileList = await searchDirectory(`${path}/${file}`);
        fileList = fileList.concat(dirFileList);
      } else {
        fileList.push(`${path}/${file}`);
      }
    }
    return fileList;
  }
  function checkImage(path: string) {
    return path.includes(".png") ||
      path.includes(".jpg") ||
      path.includes(".jpeg")
      ? true
      : false;
  }
  function deleteImageProperty(path: string) {
    let deletedImagePropertyPath = path;
    deletedImagePropertyPath = deletedImagePropertyPath.replace(".png", "");
    deletedImagePropertyPath = deletedImagePropertyPath.replace(".jpg", "");
    deletedImagePropertyPath = deletedImagePropertyPath.replace(".jpeg", "");
    return deletedImagePropertyPath;
  }

  ipcMain.handle("convertFolderImage", async (event, arg) => {
    let rootPath: string = arg;
    rootPath = rootPath.replaceAll("\\", "/");
    const dirFileList = await searchDirectory(rootPath);
    const promiseList: Array<any> = [];
    console.log(rootPath);

    for (const filePath of dirFileList) {
      let webpFilePath = filePath;
      if (filePath.includes(".webp") || !checkImage(filePath)) continue;
      webpFilePath = deleteImageProperty(webpFilePath);
      const converting = sharp(filePath)
        .resize(60, 60)
        .toFile(`${webpFilePath}.webp`);
      promiseList.push(converting);
      const promiseResultList = await Promise.allSettled(promiseList);
      const erroredPromise = promiseResultList.filter(
        (promiseResult: any) => promiseResult.status == "rejected"
      );

      console.log(filePath);
      console.log(erroredPromise);
      if (erroredPromise.length != 0) return false;
      console.log(filePath);
    }

    return true;
  });

  ipcMain.handle("convertImage", async (event, arg) => {
    let rootPath: string = arg;
    rootPath = rootPath.replaceAll("\\", "/");
    let webpFilePath = rootPath;
    if (rootPath.includes(".webp") || !checkImage(rootPath)) return false;
    webpFilePath = webpFilePath = deleteImageProperty(webpFilePath);
    const convertResult = await sharp(rootPath)
      .resize(60, 60)
      .toFile(`${webpFilePath}.webp`)
      .catch((err) => {
        console.log(err);
      });
    if (convertResult) return true;
    else return false;
  });

  if (process.env.WEBPACK_DEV_SERVER_URL) {
    console.log(process.env.WEBPACK_DEV_SERVER_URL);
    await win.loadURL(process.env.WEBPACK_DEV_SERVER_URL as string);
    if (!process.env.IS_TEST) win.webContents.openDevTools();
  } else {
    createProtocol("app");
    await win.loadURL(`app://./index.html/#image-converter`);
  }
}
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});

app.on("ready", async () => {
  if (isDevelopment && !process.env.IS_TEST) {
    // Install Vue Devtools
    try {
      await installExtension(VUEJS3_DEVTOOLS);
    } catch (e: any) {
      console.error("Vue Devtools failed to install:", e.toString());
    }
  }
  createWindow();
});

if (isDevelopment) {
  if (process.platform === "win32") {
    process.on("message", (data) => {
      if (data === "graceful-exit") {
        app.quit();
      }
    });
  } else {
    process.on("SIGTERM", () => {
      app.quit();
    });
  }
}
