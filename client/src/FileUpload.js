import React, { Component } from 'react';
import { ReactComponent as FilesIcon } from './download-icon.svg';

class FileUpload extends Component {
    state = {
        files: [],
        fileToBeSent: [],
        isExperimental: false
    }

    getFileExtention = (file) => {
        let s = String(file.name).split(".")
        let fileExtention = s[s.length - 1]
        return fileExtention
    }
    checkAllowedFiles = (files) => {
        let allowedTypes = ["txt", "csv", "pdf", "story"];
        let hasPassed = true;
        let err = '';
        if (files[0] === "") {
            hasPassed = false;
            err = "Please select a valid file to upload\n";
        }
        else {
            for (let i = 0; i < files.length; i++) {
                if (allowedTypes.every(type => this.getFileExtention(files[i]) !== type)) {
                    hasPassed = false;
                    err = 'Only the fileformats .txt, .csv and .pdf are allowed\n';
                }
            }
            // TODO: Make better more like react
            if (err !== '') {
                console.error(err)
            }
            return hasPassed
        }
    }
    MBToBits = (data) => { return data * (1000 * 1024); }
    checkAllowedSize = (files) => {
        let MAX_SIZE_MB = 10; // Can be change to another value
        var sum = 0;
        var hasPassed = true;
        var err = '';
        for (let i = 0; i < files.length; i++) {
            sum += files[i].size
        }
        if (sum > this.MBToBits(MAX_SIZE_MB)) {
            hasPassed = false;
            err = 'Files are exeding combined limit of ' + MAX_SIZE_MB + 'MB \n';
            // TODO: Give better alert messages - More in React way
            console.error(err);
        }
        return hasPassed
    }




    truncate = (input) => {
        if (input.length > 25) {
            input = input.substring(0, 25) + '...';
        } 
        return input;
    }





    handleSubmit = (e) => {
        e.preventDefault();
        let files = this.state.fileToBeSent;
        const formData = new FormData();
        console.log("IN HERE")

        if (this.checkAllowedFiles(files) && this.checkAllowedSize(files)) {
            for (let i = 0; i < files.length; i++) {
                formData.append("file", files[i]);
            }
            this.props.sendFile('files', formData, this.state.isExperimental)
        }
    }

    
    fileChange = (e) => {
        console.log("CHANGE")
        const file = e.target.files;
        if (this.props.putFile) {
            let filesArr = this.state.fileToBeSent;
            const arr = [];
            for (let i = 0; i < file.length; i++) {
                filesArr.push(file[i]);
            }
            filesArr = Array.from(new Set(filesArr.map(f => f.name))).map(name => {
                return filesArr.find(f => f.name === name)
            });
            console.log(filesArr)
            for (let i = 0; i < filesArr.length; i++) {
                arr.push(filesArr[i].name)
            }
            this.setState({ files: arr, fileToBeSent: filesArr });

            this.props.putFile(arr);
        } else {
            const set = this.props.exFiles;
            const arr = [];
            const filesArr = this.state.fileToBeSent;
            for (let i = 0; i < file.length; i++) {
                if (!set.has(file[i].name)) {
                    filesArr.push(file[i]);

                }
            }
            for (let i = 0; i < filesArr.length; i++) {
                arr.push(filesArr[i].name);
            }
            this.setState({ files: arr, fileToBeSent: filesArr });
        }
        e.target.value = null;
    }

    handleCheck = (e) => {
        this.setState({ isExperimental: !this.state.isExperimental }
        )
    }

    removeFile = (f) => {
        const files = this.state.files;
        const filesToSend = this.state.fileToBeSent;
        const set = new Set(files);
        const sendSet = new Set(filesToSend);
        set.delete(f);
        for (let i = 0; i < filesToSend.length; i++) {
            if (f === filesToSend[i].name) {

                console.log("YAY")
                sendSet.delete(filesToSend[i])
            }
        }
        const newFilesArr = [...set];
        const newFilesToSendArr = [...sendSet];
        console.log(newFilesArr.length, "NFA", newFilesToSendArr, "NFTSA");

        this.setState({ files: newFilesArr, fileToBeSent: newFilesToSendArr })
    }


    render() {
        const files = this.state.files.map(f => {
            return (
            <li key={f} className="list-group-item d-flex justify-content-between align-items-center list-files">
                <span className="upload-file-name">{this.truncate(f)}</span> 
                <span className="upload-file-remove" onClick={() => this.removeFile(f)}><i className="fas fa-times"></i></span>
            </li>)
        });
        const filesMsg =  this.state.files.length > 0 ? <span></span> : <span>Upload Files Here</span> 
        return (
            <div className="file-upload">
                <h2>Upload File</h2>
                <form onSubmit={this.handleSubmit}>
                    <div className="file-upload-container">
                        <label htmlFor="file-upload">
                            <span className="upload-icon">
                                <FilesIcon />
                            </span>
                           {filesMsg}
                        </label>
                        {this.state.files.length > 0 && <ul>
                            {files}
                        </ul>}

                        <input onChange={this.fileChange} type="file" name="" multiple id="file-upload" />
                    </div>
                    <button type="submit">Upload</button>
                </form>
            </div>
        )
    }
}
export default FileUpload;