import React, {Component} from 'react';
import ImageUploader from 'react-images-upload';
import axios from 'axios';
import './UploadFE.css';
const style = {
    color:'crimson',
    width: "50%",
    backgroundColor: "rgba(6, 224, 240, 0.7)",
    icon:"none"
};


class UploadFEP extends Component{
    constructor(props) {
        super(props);
        this.state = {
            pictures: [],
            uploaded :false
        }
        this.onDrop = this.onDrop.bind(this);
        this.uploadAllImages = this.uploadAllImages.bind(this);
    }

    onDrop(images){
        this.setState({
            pictures: images,
            uploaded:false
        });
        console.log(this.state.pictures);
    }

    async uploadAllImages(){
        console.log(this.state.pictures);
        let uploadPromises = this.state.pictures.map(async image => {
            let infoData = new FormData();
            //Image handler:
            infoData.append('image', image, image.name);
            //Description handler:
            infoData.append('Description', 'Testing from FRONT END');
            return await (axios.post('/api/uploadImage', infoData));
        })

        console.log(uploadPromises)

        Promise.all(uploadPromises).then(
            results => {
                console.log(results);
                this.setState({
                    uploaded:true
                })
                
                
            })
            .catch(e => {console.log(e)})
    }

    

    render() {
        return (
            <div className="uploader">
                <ImageUploader
                withIcon = {true}
                withPreview = {true}
                buttonText = 'Pick Images!'
                fileContainerStyle = {style}
                onChange = {this.onDrop}
                imgExtension = {['.jpg', '.png']}
                label = {"Max img size: 500 KB, supported image types: JPG and PNG"}
                maxFileSize = {512000}
                fileSizeError = {"Image cannot exceed 500 KB :("}
                fileTypeError = {"Images must be in .jpg or .png format"}
                />

                {this.state.pictures.length ?
                    <button className = "ButtonUP" onClick = {this.uploadAllImages}> Upload all Images </button> : null}
                {this.state.uploaded ?
                <h1 className = "UploadedSign"> Images Uploaded!</h1>:null}

            </div>
        );
    }
}

export default UploadFEP;
