import React, { Component } from 'react'
import Logo from './advancer_logo.png'
class Landing extends Component {
    componentDidMount() {
        document.body.style.backgroundColor = "aliceblue"
    }
    render () {
        return (
            <div className="container">
                <div className="jumbotron">
                    <div className="col-sm-8 mx-auto">
                        <h1 className="text-center">
                            <img className='image-center' src={Logo} ></img>
                            </h1>
                        </div>
                        
                </div>
                <div className="mx-auto col-sm-8  ">
                <label style={{margin:'center',fontSize:'30px'}} className="text-center ">The HR audit and compliance  platform. 
Using this advancer system, ensure your Award name and pay rate are compliant.</label>
                </div>
            </div>
        )
    }
}

export default Landing