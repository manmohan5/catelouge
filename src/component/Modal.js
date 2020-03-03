/* eslint-disable no-unused-expressions */
/* eslint-disable react/style-prop-object */
import React from 'react';
import Modal from 'react-responsive-modal';

class ModalComponent extends React.Component {
  constructor() {
    super();
    this.state = {
      category: []
    };
  }

  componentDidMount() {
    fetch('http://localhost:3001/category')
      .then(res => res.json())
      .then(data => {
        this.setState({
          category: data
        });
      });
  }

  getParentCategory = () => {
    return this.state.category.filter(c => c.parent_id === 0);
  };

  render() {
    const parentdata = this.getParentCategory();
    const cat = parentdata.map((p,i) => {
      return (
        <div key={i}> 
          <h5
            id={p.category_name}
            onClick={e => this.props.getDataByCategory(e.target.id)}
            style={{ fontWeight: 'bold' }}
          >
            {p.category_name}
          </h5>

          {this.state.category.map((c ,i)=> {
            if (c.parent_id === p.category_id) {
              return (
                <ul  key={i} style={{ listStyleType: 'none', paddingLeft: 10 }}>
                  <li
                    id={c.category_name}
                    onClick={e => this.props.getDataByCategory(e.target.id)}
                  >
                    {c.category_name}
                  </li>
                </ul>
              );
            }
          })}
        </div>
      );
    });

    return (
      <div>
        <Modal open={this.props.open} onClose={this.props.closeModal}>
          <p style={{ marginTop: 20 }}>------filter by categories------</p>

          {cat}
        </Modal>
      </div>
    );
  }
}

export default ModalComponent;
