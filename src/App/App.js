import React, { useState } from "react";
import { useFormInput, useHistoryStack } from "../Hooks/hooks";
import MenuBar from "../MenuBar/MenuBar";
import SideBar from "../Sidebar/Sidebar";
import Files from "../Files/Files";
import StatusBar from "../StatusBar/StatusBar";
import NewFileDialog from "../NewFileDialog/NewFileDialog";
import TextEdit from "../TextEdit/TextEdit";
import {isBrowser} from 'react-device-detect';
import {MdDesktopMac} from "react-icons/md";
import {IconContext} from "react-icons"

import "./App.scss";

function App() {
  const searchInput = useFormInput("");
  const historyStack = useHistoryStack();

  const [newFileDialogOpen, setNewFileDialogOpen] = useState(false);
  const [newFileDialogType, setNewFileDialogType] = useState("folder");
  const [textEditOpen, setTextEditOpen] = useState(false);
  const [textEditFileName, setTextEditFileName] = useState("");
  const [textEditFileText, setTextEditFileText] = useState("");

  function openTextEdit(name) {
    const currentFolder = historyStack.currentFolder();
    const files = searchInput.value
      ? getSearchedFiles(currentFolder)
      : currentFolder;

    setTextEditOpen(true);
    setTextEditFileName(name);
    setTextEditFileText(files[name].text);
  }

  function closeTextEdit() {
    setTextEditOpen(false);
  }

  function saveChangesToFile(text) {
    setTextEditFileText(text);

    const files = searchInput.value
      ? getSearchedFiles(currentFolder)
      : historyStack.currentFolder();

    files[textEditFileName].text = text;
    localStorage.setItem("files", JSON.stringify(historyStack.root()));
  }

  function createNewFile(name) {
    const currentFolder = historyStack.currentFolder();

    if (newFileDialogType === "folder") {
      currentFolder[name] = { type: "folder", files: {} };
    } else {
      currentFolder[name] = { type: "textfile", text: "" };
    }

    historyStack.updateCurrentFolder(currentFolder);

    setNewFileDialogOpen(false);
    localStorage.setItem("files", JSON.stringify(historyStack.root()));
  }

  function getSearchedFiles(folder) {
    let files = {};
    for (const fileName in folder) {
      if (
        folder[fileName].type === "textfile" &&
        fileName.toLowerCase().includes(searchInput.value.toLowerCase())
      ) {
        files[fileName] = folder[fileName];
      } else {
        files = { ...files, ...getSearchedFiles(folder[fileName].files) };
      }
    }
    return files;
  }

  function openNewFileDialog(type) {
    if (!searchInput.value) {
      setNewFileDialogOpen(true);
      setNewFileDialogType(type);
    }
  }

  const currentFolder = historyStack.currentFolder();
  const files = searchInput.value
    ? getSearchedFiles(currentFolder)
    : currentFolder;

  const filesNames = Object.keys(files || {});

  const filesCount = filesNames.length;
  const textfilesCount = filesNames.filter(
    fileName => files[fileName].type === "textfile"
  ).length;

  const favorites = ["MacintoshHD", "Documents", "Downloads", "Desktop"];

if(isBrowser){
  return (
    <div id="window">
      <TextEdit
        isModalOpen={textEditOpen}
        text={textEditFileText}
        name={textEditFileName}
        saveChangesToFile={name => saveChangesToFile(name)}
        closeTextEdit={() => closeTextEdit()}
      />
      <NewFileDialog
        modalIsOpen={newFileDialogOpen}
        fileType={newFileDialogType}
        onClickCancel={() => setNewFileDialogOpen(false)}
        onClickSave={name => createNewFile(name)}
      />
      <div id="finder">
        <MenuBar
          searchInput={searchInput.value}
          onSearchInputChange={e => searchInput.onChange(e)}
          navigateBackward={() => historyStack.navigateBackward()}
          navigateForward={() => historyStack.navigateForward()}
          disableBackButton={historyStack.backwardHistory.length <= 1}
          disableForwardButton={historyStack.forwardHistory.length === 0}
        />
        <SideBar
          favorites={favorites}
          navigateToFavorite={folderName =>
            historyStack.navigateToFavorite(folderName)
          }
        />
        <Files
          files={files}
          navigateToFolder={name => historyStack.navigateToFolder(name)}
          openTextEdit={name => openTextEdit(name)}
          openNewFileDialog={type => openNewFileDialog(type)}
        />
        <StatusBar filesCount={filesCount} textFilesCount={textfilesCount} />
      </div>
    </div>
  );
  }
  else{
  return <div id="container">
    <h1 style={{fontSize:16, color:"white", textAlign:'center', paddingTop: 50, fontFamily:'Verdana', fontWeight:'bold'}}>
      <IconContext.Provider value={{ style: {fontSize: '200px'}}}>  <MdDesktopMac/> </IconContext.Provider>
      <br/>
      Hey there! 
      <br/><br/>
      Looks like you're trying to view this site on a phone-
      <br/><br/>
      Mind switching to your computer for a non-distorted and cleaner view of the website?
      <br/><br/>
      If you're ok with a little bit of distorted content and wish to proceed, use the "Desktop Site" view from your browser options! :)
      </h1>
  </div>
  }
}

export default App;
