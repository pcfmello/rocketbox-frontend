import React, { Component } from 'react'
import API from '../../services/api'
import {formatDistance} from 'date-fns'
import pt from 'date-fns/locale/pt'
import Dropzone from 'react-dropzone'
import socket from 'socket.io-client'

import {MdInsertDriveFile} from 'react-icons/md'

import logo from '../../assets/logo.jpeg'
import './styles.css'
import api from '../../services/api'

export default class Box extends Component {

    state = {
        box: {}
    }

    async componentDidMount() {

        this.subscribeToNewFiles()

        const boxId = this.props.match.params.id
        const response = await API.get(`/boxes/${boxId}`)

        this.setState({ box: response.data })
    }

    subscribeToNewFiles = () => {
        const boxId = this.props.match.params.id
        const io = socket("localhost:3333")

        io.emit('connectRoom', boxId)

        io.on('file', data => {
            this.setState({box: { ...this.state.box, files: [data, ...this.state.box.files] }})
        })
    }

    handleUpload = (files) => {
        files.forEach(file => {
            const data = new FormData()
            const boxId = this.props.match.params.id

            data.append("file", file)

            api.post(`boxes/${boxId}/files`, data)
        })
    }

    render() {

        return (
            <div id="box-container">
                <header>
                    <img src={logo} alt="" />
                    <h1>{this.state.box.title}</h1>
                </header>
                <Dropzone onDropAccepted={this.handleUpload}>
                    {({getRootProps, getInputProps}) => (
                        <div className="upload" {...getRootProps()}>
                            <input {...getInputProps()} />
                            <p>Arraste arquivos ou clique aqui   </p>
                        </div>
                    )}
                </Dropzone>
                {this.state.box.files && !this.state.box.files.length && <div className="emptyList">Lista vazia</div>}
                {this.state.box.files && !!this.state.box.files.length && 
                    <ul>
                        {!!this.state.box.files && this.state.box.files.map(file => (
                            <li key={file._id}>
                                <a className="fileInfo" href={file.url} target="_blank">
                                    <MdInsertDriveFile size={24} color="#a5cfff" />
                                    <strong>{file.title}</strong>
                                </a>
                                <span>há {formatDistance(new Date(file.createdAt), new Date(), { locale: pt })}</span>
                            </li>
                        ))}
                        
                    </ul>                
                }
            </div>
        )
    }
}