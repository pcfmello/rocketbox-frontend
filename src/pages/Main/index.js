import React, { Component } from 'react'
import './styles.css'
import logo from '../../assets/logo.jpeg'
import API from '../../services/api'

export default class Main extends Component {

    state = {
        newBox: ''
    }

    handleSubmit =  async e => {
        e.preventDefault();
        
        const response = await API.post('/boxes', {
            title: this.state.newBox
        })

        this.props.history.push(`/box/${response.data._id}`)
    }

    handleInputChange = e => {
        this.setState({ newBox: e.target.value })
    }

    render() {
        return (
            <div id="main-container">
                <form onSubmit={this.handleSubmit}>
                    <img src={logo} alt="" />
                    <div className="fields">
                        <input placeholder="Criar um box" onChange={this.handleInputChange}/>
                        <button type="submit">Criar</button>
                    </div>
                </form>
            </div>
        )
    };
}