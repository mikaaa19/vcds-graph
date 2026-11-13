import { get, reject } from 'lodash';
import React from 'react';
import { withSnackbar } from 'notistack';

import { UNABLE_TO_IMPORT } from 'constants/messages';
import { load, save } from 'utils/storage';

export const FileContext = React.createContext();

class FileContextProvider extends React.Component {

    state = {
        files: load('files', []),
        selectedFileName: null,
        lastAddedFileName: null
    }

    componentDidMount() {
        const firstFile = get(this.state.files, ['0', 'name'], null);
        if (firstFile) {
            this.setState({ selectedFileName: firstFile });
        }
    }

    componentDidUpdate(previousProps, previousState) {
        if (previousState.files !== this.state.files) {
            try {
                save('files', this.state.files);
            } catch (error) {
                this.props.enqueueSnackbar('Lokaler Speicher ist voll. Bitte einige Messungen entfernen.', {
                    anchorOrigin: { vertical: 'bottom', horizontal: 'center' },
                    autoHideDuration: 6000
                });
            }
        }
    }

    addFile = (file) => {
        this.setState({
            files: [...this.state.files, file],
            selectedFileName: file.name,
            lastAddedFileName: file.name
        });
    }

    removeFile = (fileName) => {
        const { files, selectedFileName } = this.state;
        const newFiles = reject(files, ['name', fileName]);

        const newSelectedFileName = (fileName === selectedFileName)
                                  ? get(newFiles, ['0', 'name'], null)
                                  : selectedFileName;

        this.setState({
            files: newFiles,
            selectedFileName: newSelectedFileName
        });
    }

    removeInvalidFile = () => {
        this.props.enqueueSnackbar(UNABLE_TO_IMPORT(this.state.lastAddedFileName), {
            anchorOrigin: {
                vertical: 'bottom',
                horizontal: 'center',
                autoHideDuration: 5000
            }
        });

        this.removeFile(this.state.lastAddedFileName);
    }

    selectFile = (fileName) => {
        this.setState({ selectedFileName: fileName });
    }

    render() {
        const names = this.state.files.map(({ name }) => (name));

        return (
            <FileContext.Provider value={{
                files: this.state.files,
                fileNames: names,
                selectedFileName: this.state.selectedFileName,
                addFile: this.addFile,
                removeFile: this.removeFile,
                removeInvalidFile: this.removeInvalidFile,
                selectFile: this.selectFile
            }}>
                {this.props.children}
            </FileContext.Provider>
        );
    }
}

FileContextProvider.contextType = FileContext;

export default withSnackbar(FileContextProvider);
