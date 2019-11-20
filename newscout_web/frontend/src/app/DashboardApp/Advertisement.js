import React from 'react';
import ReactDOM from 'react-dom';
import Select from 'react-select';
import { ToastContainer } from 'react-toastify';
import * as serviceWorker from './serviceWorker';
import DashboardMenu from '../../components/DashboardMenu';
import DashboardHeader from '../../components/DashboardHeader';
import { ADVERTISEMENT_URL, GROUP_GROUPTYPE_URL } from '../../utils/Constants';
import { getRequest, postRequest, fileUploadHeaders,  deleteRequest, notify } from '../../utils/Utils';
import { Button, Form, FormGroup, Input, Label, FormText, Modal, ModalHeader, ModalBody, ModalFooter, Row, Col, Table } from 'reactstrap';

import './index.css';

class Advertisement extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			modal: false,
			fields: {},
			errors: {},
			rows: {},
			formSuccess: false,
			groups: [],
			grouptypes: [],
			results: [],
		};
	}

	handleValidation = () => {
		let fields = this.state.fields;
		let errors = {};
		let formIsValid = true;
		let required_msg = "This fields is required";

		if(!fields["ad_text"]){
			formIsValid = false;
			errors["ad_text"] = required_msg;
		}

		if(!fields["ad_url"]){
			formIsValid = false;
			errors["ad_url"] = required_msg;
		} else if (!this.valid_url(fields["ad_url"])) {
			formIsValid = false;
			errors["ad_url"] = "Not valid url";
		}

		this.setState({errors: errors});
		return formIsValid;
	}

	valid_url = (url) => {
		var regexp = /^(?:(?:https?|ftp):\/\/)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:\/\S*)?$/;
		if (regexp.test(url)) {
			return true;
		} else {
			return false;
		}
	}

	handleChange = (field, e) => {
		let fields = this.state.fields;
		if(field === "adgroup" || field === "ad_type"){
			fields[field] = e.value;
		} else if(e.target.files) {
			fields[field] = e.target.files[0];
		} else {
			fields[field] = e.target.value;
		}
		if(this.handleValidation()){
			this.setState({fields});
		}
	}

	advertisementSubmitResponse = (data) => {
		this.setState({'formSuccess': true});
		setTimeout(() => {
			this.setState({'modal': false, 'formSuccess': false});
			this.getAdvertisements()
        }, 3000);
	}

	advertisementSubmit = (e) => {
		e.preventDefault();

		if(this.handleValidation()){
			const body = new FormData();
			body.set('adgroup', this.state.fields.adgroup)
			body.set('ad_type', this.state.fields.ad_type)
			body.set('ad_text', this.state.fields.ad_text)
			body.set('ad_url', this.state.fields.ad_url)
			body.set('file', this.state.fields.media)
			postRequest(ADVERTISEMENT_URL, body, this.advertisementSubmitResponse, "POST", fileUploadHeaders);
		}else{
			this.setState({'formSuccess': false});
		}
	}

	toggle = () => {
		this.setState(prevState => ({
			modal: !prevState.modal
		}));
	}

	editRow = (e) => {
		let dataindex = e.target.getAttribute('data-index');
		let rows = this.state.rows;
		rows[dataindex] = true
		this.setState({rows});
	}

	cancelRow = (e) => {
		var dataindex = e.target.getAttribute('data-index');
		let rows = this.state.rows;
		rows[dataindex] = false
		this.setState({rows});
	}

	deleteAdvertisementResponse = (data) => {
		notify(data.body.Msg)
	}

	deleteRow = (e) => {
		let dataindex = e.target.getAttribute('data-index');
		let findrow = document.body.querySelector('[data-row="'+dataindex+'"]');
		let url = ADVERTISEMENT_URL + dataindex + "/";
		deleteRequest(url, this.deleteAdvertisementResponse)
		setTimeout(function() {
			findrow.style.transition = '0.8s';
			findrow.style.opacity = '0';
			document.getElementById("group-table").deleteRow(findrow.rowIndex);
		}, 1000);
	}

	getGroupAndGroupType = (data) => {
		let groups_array = []
		let groupstype_array = []
		
		if(data.body.groups){
			data.body.groups.map((item, index) => {
				let group_dict = {}
				group_dict['value'] = item.id
				group_dict['label'] = item.campaign.name
				group_dict['name'] = item.campaign.name
				groups_array.push(group_dict)
			})
		}

		if(data.body.types){
			data.body.types.map((item, index) => {
				let types_dict = {}
				types_dict['value'] = item.id
				types_dict['label'] = item.type
				types_dict['name'] = item.type
				groupstype_array.push(types_dict)
			})
		}

		this.setState({
			"groups": groups_array,
			"grouptypes": groupstype_array
		})
	}

	getAdvertisements = (data) => {
		var url = ADVERTISEMENT_URL;
		getRequest(url, this.getAdvertisementData);
	}

	getAdvertisementData = (data) => {
		this.setState({
			'results': data.body
		})
	}

	componentDidMount() {
		this.getAdvertisements()
		var group_type_url = GROUP_GROUPTYPE_URL;
		getRequest(group_type_url, this.getGroupAndGroupType)
	}

	render(){
		let result_array = this.state.results
		let results = []

		result_array.map((el, index) => {
			var data = <tr key={index} data-row={el.id}>
				<th scope="row">{index+1}</th>
				<td>
					{this.state.rows[el.id] ?
						<React.Fragment>
							<Select refs="adgroup" value={this.state.fields["adgroup"]} onChange={(e) => this.handleChange("adgroup", e)} options={this.state.groups} />
							<FormText color="danger">{this.state.errors["adgroup"]}</FormText>
						</React.Fragment>
					:
						<span>{el.adgroup.campaign.name}</span>
					}
				</td>
				<td>
					{this.state.rows[el.id] ?
						<React.Fragment>
							<Select refs="adgroup" value={this.state.fields["ad_type"]} onChange={(e) => this.handleChange("ad_type", e)} options={this.state.grouptype} />
							<FormText color="danger">{this.state.errors["ad_type"]}</FormText>
						</React.Fragment>
					:
						<span>{el.ad_type.type}</span>
					}
				</td>
				<td>
					{this.state.rows[el.id] ?
						<React.Fragment>
							<input refs="ad_text" type="text" name="ad_text" className="form-control" placeholder="Advertisement Title" id="advertisementtext" onChange={(e) => this.handleChange("ad_text", e)} value={`Test${el}`} />
							<FormText color="danger">{this.state.errors["ad_text"]}</FormText>
						</React.Fragment>
					:
						<span>{el.ad_text}</span>
					}
				</td>
				<td>
					{this.state.rows[el.id] ?
						<React.Fragment>
							<input refs="ad_url" type="text" name="ad_url" className="form-control" placeholder="Advertisement Url" id="ad-url" onChange={(e) => this.handleChange("ad_url", e)} value={`Test${el}`} />
							<FormText color="danger">{this.state.errors["ad_url"]}</FormText>
						</React.Fragment>
					:
						<span><a href={el.ad_url} target="_blank">{el.ad_url}</a></span>
					}
				</td>
				{this.state.rows[el.id] ?
					<td><input refs="media" type="file" name="media" id="ad-media" /></td>
				:
					<td className="text-primary">{el.media}</td>
				}
				{this.state.rows[el.id] ?
					<td><input type="checkbox" name="is_active" /></td>
				:
					<React.Fragment>
						{el.is_active ?
							<React.Fragment>
								<td className="text-success">Active</td>
							</React.Fragment>
						:
							<React.Fragment>
								<td>-</td>
							</React.Fragment>
						}
					</React.Fragment>
				}
				<td>
					<ul className="list-inline m-0">
						{this.state.rows[el.id] ?
							<React.Fragment>
								<li className="list-inline-item">
									<a href="" className="btn btn-sm btn-success">Save</a>
								</li>
								<li className="list-inline-item btn btn-sm btn-danger" data-index={el.id} onClick={this.cancelRow}>Cancel</li>
							</React.Fragment>
						:
							<React.Fragment>
								<li className="list-inline-item btn btn-sm btn-warning" data-index={el.id} onClick={this.editRow}>Edit</li>
								<li className="list-inline-item btn btn-sm btn-danger" data-index={el.id} onClick={this.deleteRow}>Delete</li>
							</React.Fragment>
						}
					</ul>
				</td>
			</tr>
			results.push(data);
		})

		return(
			<React.Fragment>
				<ToastContainer />
				<div className="group">
					<DashboardHeader />
					<div className="container-fluid">
						<div className="row">
							<DashboardMenu />
							<main role="main" className="col-md-9 ml-sm-auto col-lg-10 px-4">
								<div className="mb-3">
									<h1 className="h2">Advertisement</h1>
									<div className="clearfix">
										<div className="float-left">
											<Button color="success" size="md" onClick={this.toggle}>Add new</Button>
										</div>
										<div className="float-right">
											<Form>
												<Input type="text" name="query" className="form-control" placeholder="search" />
											</Form>
										</div>
									</div>
								</div>
								<hr/>
								<div className="my-5">
									<h5 className="text-info">Total {this.state.results.length} Advertisement</h5>
									<Table striped id="group-table">
										<thead>
											<tr>
												<th style={{width:"5%"}}>#</th>
												<th style={{width:"10%"}}>Ad. Group</th>
												<th style={{width:"10%"}}>Ad. Type</th>
												<th style={{width:"20%"}}>Advertisement Title</th>
												<th style={{width:"20%"}}>Advertisement Url</th>
												<th style={{width:"15%"}}>Media</th>
												<th style={{width:"10%"}}>Status</th>
												<th style={{width:"10%"}}></th>
											</tr>
										</thead>
										<tbody>
											{results}
										</tbody>
									</Table>
								</div>
							</main>
						</div>
					</div>

					<Modal isOpen={this.state.modal} toggle={this.toggle}>
						<ModalHeader toggle={this.toggle}>Add new advertisement</ModalHeader>
						<ModalBody>
							<Form>
								<FormGroup>
									<Label for="adgroup">Select Group</Label>
									<Select refs="adgroup" value={this.state.fields["adgroup"] ? this.state.fields["adgroup"].value : ''} onChange={(e) => this.handleChange("adgroup", e)} options={this.state.groups} />
									<FormText color="danger">{this.state.errors["adgroup"]}</FormText>
								</FormGroup>
								<FormGroup>
									<Label for="ad_type">Select Group Type</Label>
									<Select refs="ad_type" value={this.state.fields["ad_type"] ? this.state.fields["ad_type"].value : ''} onChange={(e) => this.handleChange("ad_type", e)} options={this.state.grouptypes} />
									<FormText color="danger">{this.state.errors["ad_type"]}</FormText>
								</FormGroup>
								<FormGroup>
									<Label for="ad_text">Advertisement Title</Label>
									<input refs="ad_text" type="text" name="ad_text" className="form-control" placeholder="Advertisement Title" id="advertisementtext" onChange={(e) => this.handleChange("ad_text", e)} value={this.state.fields["ad_text"]} />
									<FormText color="danger">{this.state.errors["ad_text"]}</FormText>
								</FormGroup>
								<FormGroup>
									<Label for="ad_url">Advertisement Url</Label>
									<input refs="ad_url" type="text" name="ad_url" className="form-control" placeholder="Advertisement Url" id="ad-url" onChange={(e) => this.handleChange("ad_url", e)} value={this.state.fields["ad_url"]} />
									<FormText color="danger">{this.state.errors["ad_url"]}</FormText>
								</FormGroup>
								<FormGroup>
									<Label for="media">Media</Label>
									<input refs="media" type="file" name="media" className="form-control-file" id="ad-media" onChange={(e) => this.handleChange("media", e)} />
									<FormText color="danger">{this.state.errors["media"]}</FormText>
								</FormGroup>
							</Form>
						</ModalBody>
						<ModalFooter>
							<div className="clearfix" style={{width:"100%"}}>
								<div className="float-left">
									{this.state.formSuccess ?
										<h6 className="text-success m-0">Form submitted successfully.</h6>
									: ""}
								</div>
								<div className="float-right">
									<Button color="success" onClick={this.advertisementSubmit} type="button">Submit</Button>&nbsp;&nbsp;
									<Button color="secondary" onClick={this.toggle} type="button">Cancel</Button>
								</div>
							</div>
						</ModalFooter>
					</Modal>
				</div>
			</React.Fragment>
		);
	}
}

export default Advertisement;

ReactDOM.render(<Advertisement />, document.getElementById('root'));
serviceWorker.unregister();