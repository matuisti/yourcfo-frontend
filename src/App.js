import React, {Component} from 'react';
import axios from 'axios'
import './App.css';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedFile: null,
      loaded: 0,
      csvJson: null,
      csvLoad: false
    }
  }

  componentDidMount() {

  }

  handleselectedFile = event => {
    this.setState({
      selectedFile: event.target.files[0],
      loaded: 0,
    })
  }

  getCsv(file) {
    axios.get('/api/op', {
      params: {
        file: file
      }
    })
    .then(response => {
      console.log(response.data);
      this.setState({
        csvJson: response.data,
        csvLoad: true
      })
    })
    .catch(error => {
      console.log(error);
    })
  };

  handleUpload = () => {
    const formData = new FormData()
    if (this.state.selectedFile) {
      formData.append('file', this.state.selectedFile, this.state.selectedFile.name)
      axios.post('/upload', formData, {
        onUploadProgress: ProgressEvent => {
          this.setState({
            loaded: (ProgressEvent.loaded / ProgressEvent.total * 100)
          })
        }
      }).then(res => {
        this.getCsv(res.data.file);
      }).catch(function (error) {
        console.log(error);
      })
    } else {
      alert('Lisää tiedosto');
    }
  }

  render() {
    return (
      <div className="App">
        <input type="file" name="" id="" onChange={this.handleselectedFile} />
        <button onClick={this.handleUpload}>Upload</button>
        <div> {Math.round(this.state.loaded, 2)} %</div>
        {!this.state.csvLoad ? <div>Syötä csv</div> : <div><pre>{JSON.stringify(this.state.csvJson) }</pre></div>}
      </div>
    );
  }
}

export default App;
