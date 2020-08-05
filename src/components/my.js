import React, { Component } from 'react'
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css"
import Loader from 'react-loader-spinner'
import "./styles.css"
import renderIf from './renderIf'
import Logo from './advancer_logo.png'
import axios from 'axios'
import "../../node_modules/@fortawesome/fontawesome-free/css/all.min.css"
import  { Redirect } from 'react-router-dom'
import { FcCheckmark,FcCancel } from "react-icons/fc";
class My extends Component {
    constructor() {
        super()
        this.state = {
            first_name: '',
            date: '',
            email: '',
            pay:'',
            award: '',
            imageUrl:'',
            score:'',
            status:false,
            status2:false,
            loading:false,
            loader:false,
            name_check:false,
            dob_check:false,
            award_check:false,
            pay_check:false,
        }
        this.handleUploadImage = this.handleUploadImage.bind(this);

        this.onChange = this.onChange.bind(this)
        this.onSubmit = this.onSubmit.bind(this)
    }
  

  handleUploadImage() {

    const data = new FormData();
    data.append('file', this.uploadInput.files[0]);
    data.append('filename', this.uploadInput.files[0]);
    fetch('http://localhost:3000/upload', {
      method: 'POST',
      body: data,
    }).then((response) => {
      response.json().then((body) => {
        this.setState({ imageURL: `http://localhost:3000/${body.file}` });
      });
    });
  }
    onChange (e) {
        this.setState({ [e.target.name]: e.target.value })
    }

    onSubmit (e) {
        e.preventDefault()
    }
    componentDidMount() {
      document.body.style.backgroundColor = "aliceblue"
  }
     handleChange = (e) => {
       this.setState({inputValue: e.target.value});
     }
     generateAlert = () => {
          alert("Please upload only docx or pdf file !!");
  }
     toggleStatus(){
       this.handleUploadImage()
       var ext;
       if(this.uploadInput.files[0]){
        ext= this.uploadInput.files[0].name.split(".")
       }
      if(!this.uploadInput.files[0]  ){
        this.generateAlert()
      }
      else{
        if( ext[1] == "docx" || ext[1] == "pdf"){
          
          this.setState({
            
            status:!this.state.status
          })
          console.log('toggle button handler: '+ this.state.status);
          }
        else{ 
          this.generateAlert()
      }
    }
    }
      toggleStatus2(){
        this.fetchHelloWorld()
        this.setState({
          loader:true,
          status2:!this.state.status2
        });
        console.log('toggle button handler: '+ this.state.status2);
        
      }
      email(){
        if (!(new RegExp(/[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,15}/g).test(this.state.email))){
          alert("This is Not a Valid EmailID!!");
        }
        else{
          var myParams= {
            name:this.state.first_name,
            dob: this.state.date,
            pay: this.state.pay,
            email: this.state.email,
            award:this.state.award,
            score:this.state.score,
          }
          axios.post('http://localhost:5000/email', myParams)
            .then(function(response){
                console.log(response);
       //Perform action based on response
        })
        alert("Email Sent!!");
        this.myFunction()
         

        }
    }
    myFunction=() =>{
      this.props.history.push('/')
     }
      fetchHelloWorld() {
        console.log("fetching python localhost");
        fetch('http://127.0.0.1:5000/data', {
          method: 'GET',
        })
          .then(r => r.json())
          .then(data => {
            if (data.award===""){
              this.setState({
                pay_check:true
                
              })
            }
            else if (parseInt(data.pay)<0){
              data.pay=-1*parseInt(data.pay)
              this.setState({
                pay_check:true
                
              })
            }
            this.setState({
              first_name: data.name,
              date:data.date,
              award:data.award,
              pay:data.pay,
              score:data.score,
              loader:false,
              loading:true
            })
            if (data.name===""){
              this.setState({
                name_check:true
              })
            }
          })
          .catch(err => console.log(err))
      }
    render () {
        return (
          <div id="div">
            <div  className="block-example border border-info mx-auto mt-2" style={{width:'1100px',height:'130px'}} >
            <div style={{marginLeft:100}}>
                            <div className="mx-auto " >
                                <input style={{margin:"10px"}} ref={(ref) => { this.uploadInput = ref; }} type="file"/>
                                <button id="btn-1" className="btn btn-lg btn-primary" onClick={()=>this.toggleStatus()}>Upload</button>
                                {renderIf(this.state.status)(<button id="btn-2" className="btn btn-lg btn-primary mt-1 " onClick={()=> this.toggleStatus2()}>Verify</button>)}
                                </div>
                                {renderIf(this.state.loader)(<Loader id="load" style={{display: 'flex',  justifyContent:'center', alignItems:'center', height: '50vh'}}
                            type="Circles"
                            color="#00BFFF"
                            height={100}
                            />)}
                            </div>
                            </div>
                            
                        
                            
                        {renderIf(this.state.loading)(
                          <div  className="block-example border border-info mx-auto mt-3" style={{width:'1100px',height:'350px'}} >
                        
                        <div className="col-md-6 mx-auto mt-3">
                          
 
                    <form noValidate  onSubmit={this.onSubmit}>
                        
                     <div class="form-row">
                        
                        <label class="col-sm-2 col-form-label" style={{fontWeight:'bold'}}  for="name">Name:</label>
                        <input type="text" class="form-control col-sm-8" name="first_name" id="name" value={this.state.first_name} />
                        { (this.state.first_name==="")?(<FcCancel size="30"/>) :(<FcCheckmark size="30"/>) }
                        
                        
                            </div>
                    <br/>
                    <div class="form-row">
                        <label class="col-sm-2 col-form-label" style={{fontWeight:'bold'}}  for="name">DOB:</label>
                        <input type="text" class="form-control col-sm-8" name="dob" id="name" value={this.state.date}/>
                        { (this.state.date==="")?(<FcCancel size="30"/>) :(<FcCheckmark size="30"/>) }
                    </div>
                    <br/>
                    <div class="form-row">
                        <label class="col-sm-2 col-form-label" style={{fontWeight:'bold'}}  for="name">Award:</label>
                        <input type="email" class="form-control col-sm-8" name="Award" value={this.state.award} id="name" />
                        { (this.state.award==="")?(<FcCancel size="30"/>) :(<FcCheckmark size="30"/>) }
                    </div>
                    <br/>
                    <div class="form-row">
                        <label class="col-sm-2 col-form-label" style={{fontWeight:'bold'}}  for="name">Weekly Pay:</label>
                        <input type="text" class="form-control col-sm-8" name="pay" id="name" value={"$"+this.state.pay}/>
                        { (this.state.pay_check )?(<FcCancel size="30"/>) :(<FcCheckmark size="30"/>) }
                    </div>
                    <br/>
                    <label id="score"style={{marginLeft:50,fontWeight:'bold',fontSize:'20px'}}className="col-md-20 mt-20 " >The compliance score of the contract is : {this.state.score}%</label>
                    </form>
                    </div>
                    </div>
                    )}
                    {renderIf(this.state.loading)(
                       <div  className="block-example border border-info mx-auto mt-2" style={{width:'1100px',height:'130px'}} >
                      <div className="col-md-6 mx-auto mt-2" >
                        
                      <form noValidate  onSubmit={this.onSubmit} >
                    <div class="form-row">
                        <label class="col-sm-2 col-form-label" style={{fontWeight:'bold'}} >Email:</label>
                        <input type="text" class="form-control col-sm-8" name="email" id="name" onChange={this.onChange} value={this.state.email}/>
                        <button id="btn-3" className="btn btn-lg btn-primary form-control ml-10 col-sm-5 mt-4 mx-auto" onClick={()=>this.email()}>Send Report</button>
                        </div>  
                    </form>
                    </div>
                    </div>)}
                </div>
        )
    }
}

export default My