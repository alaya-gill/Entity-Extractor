import React, { Component } from 'react'
import { Link, withRouter } from 'react-router-dom'
import Logo from './advancer_logo.png'
import "./styles.css"
class Navbar extends Component {
    logOut (e) {
        e.preventDefault()
        localStorage.removeItem('usertoken')
        this.props.history.push(`/`)
    }

    render () {

        return (
            <nav className="navbar navbar-expand-lg navbar-dark color-nav rounded">
                <button className="navbar-toggler"
                    type="button"
                    data-toggle="collapse"
                    data-target="#navbar1"
                    aria-controls="navbar1"
                    aria-expanded="false"
                    aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div >
                <img  style={{height:40}} src={Logo} alt='logo'>
                            </img>
                </div>
                
                <div className="collapse navbar-collapse justify-content-md-center"
                    id="navbar1">
                    <ul className="navbar-nav">
                        <li className="nav-item">
                            <Link to="/" className="nav-link">
                                Home
                            </Link>
                        </li>
                        <li className="nav-item">
                    <Link to="/my" className="nav-link">
                        Contract
                    </Link>
                </li>
                        
                    </ul>
                    
                </div>
            </nav>
        )
    }
}

export default withRouter(Navbar)