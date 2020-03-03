/* eslint-disable jsx-a11y/anchor-is-valid */

import React, { Component } from 'react';
import Modal from './Modal';

var request = require('request-promise');

class Product extends Component {
  constructor() {
    super();
    this.state = {
      data: [],
      productDescription: [],
      brand: [],
      dis: 'none',
      disProduct: 'flex',
      dropdown: '',
      dropdownParent: '',
      productDesDisplay: true,
      open: false,
      category: [],
      childCategory: []
    };
  }

  componentDidMount() {
    fetch(`http://localhost:3001/category`)
      .then(res => res.json())
      .then(category => {
        this.setState({
          category
        });
      });

    fetch('http://localhost:3001/products')
      .then(res => res.json())
      .then(data => {
        this.setState({
          data
        });
      });

    fetch('http://localhost:3001/brand')
      .then(res => res.json())
      .then(brand => {
        this.setState({
          brand
        });
      });
  }



  getchildCategory = name => {
    fetch(`http://localhost:3001/category/categorytree/${name}`)
      .then(res => res.json())
      .then(childCategory => {
        this.setState({
          childCategory,
          dropdown: name
        });
      });
  };

  getDataByCategory = name => {
    this.setState({
      data: []
    });
    fetch(`http://localhost:3001/category/categorytree/${name}`)
      .then(res => res.json())
      .then(catdata => {
        catdata.map(c => {
          fetch(`http://localhost:3001/category/${c.category_name}`)
            .then(res => res.json())
            .then(data => {
              this.setState({
                data: this.state.data.concat(data),
                productDesDisplay: true,
                open: false
              });
            });
        });
      })

      .catch(console.log);
  };

  filterByBrand = name => {
    fetch(`http://localhost:3001/brand/${name}`)
      .then(res => res.json())
      .then(data => {
        this.setState({
          data: data
        });
      })
      .catch(console.log);
  };

  handleCancel = () => {
    this.setState({
      dis: 'none',
      disProduct: 'flex'
    });
  };

  getProductDetails = name => {
    fetch(`http://localhost:3001/products/${name}`)
      .then(res => res.json())
      .then(data => {
        this.setState({
          productDescription: data,
          productDesDisplay: !this.state.productDesDisplay
        });
      })
      .catch(console.log);
  };

  handleAdd = () => {
    if (this.state.dis !== 'none') {
      const name = this.refs['name'].value;
      const brand = this.refs['brand'].value;
      const category = this.state.dropdown;

      if (name === '' || brand === '' || category === '') {
        alert('can`t add empty data');
        return;
      }
      var options = {
        uri: 'http://localhost:3001/products',
        method: 'POST',
        json: {
          product_name: name,
          brand_name: brand,
          category_name: category
        }
      };

      // fetch(
      //   `http://localhost:3001/products/?product_id=${id}&product_name=${name}&product_brand=${brand}&category=${category}`,

      //   {
      //     method: 'POST'
      //   }
      // )
      //   .then(res => res.json())
      //   .then(d => {
      //     // this.setState({
      //     //   data: this.state.data.concat(d),
      //     //   dis: 'none',
      //     //   disProduct: 'flex'
      //     // });
      //     console.log(d);
      //     alert('add succesfully');
      //     this.setState({
      //       data: this.state.data.concat(d),
      //       dis: 'none',
      //       disProduct: 'flex'
      //     });
      //   })
      //   .catch(console.log);

      request(options).then(res => {
        if (!Array.isArray(res)) {
          alert('duplicate product ');
        } else {
          alert('add succesfully');
          this.setState({
            dis: 'none',
            disProduct: 'flex',
            data: this.state.data.concat(res),
            brand: this.state.brand.concat(res)
          });
        }
      });
    } else {
      this.setState({
        dis: 'flex',
        disProduct: 'none'
      });
    }
  };
  onCloseModal = () => {
    this.setState({ open: false });
  };

  render() {
    const childcategory = this.state.childCategory.map((c, i) => {
      return (
        <option key={i} value={c.category_name}>
          {c.category_name}
        </option>
      );
    });

    const categoryAddOptions = this.state.category.map((c, i) => {
      if (c.parent_id === 0) {
        return (
          <option key={i} value={c.category_name}>
            {c.category_name}
          </option>
        );
      }
    });

    const Displayproduct = this.state.data.map((d, index) => {
      return (
        <thead key={index}>
          <tr>
            <td
              id={d.product_name}
              onClick={e => this.getProductDetails(e.target.id)}
              style={styles.td}
            >
              {d.product_name}
            </td>
          </tr>
        </thead>
      );
    });

    const selectOptionBrand = this.state.brand.map((b, i) => {
      return (
        <option key={i} value={b.brand_name}>
          {b.brand_name}
        </option>
      );
    });


    const productDesDisplay = this.state.productDescription.map(p => {
      return (
        <div>
          <h5>name:{p.product_name}</h5>
        </div>
      );
    });

    const parent_category =
      this.state.productDescription[0] &&
      this.state.productDescription[0].category_name;

    return (
      <React.Fragment>
        <Modal
          open={this.state.open}
          closeModal={this.onCloseModal}
          getDataByCategory={this.getDataByCategory}
        />

        <div>
          <ul className="breadcrumb">
            <li>
              <a href="/">Home</a>
            </li>
            <li>
              <a href="/products">Products</a>
            </li>
            <li
              style={{
                display: this.state.productDesDisplay ? 'none' : 'inline'
              }}
            >
              <a
                id={parent_category}
                onClick={e => this.getDataByCategory(e.target.id)}
              >
                {parent_category}
              </a>
            </li>
          </ul>
        </div>
        <div
          style={{ display: this.state.productDesDisplay ? 'none' : 'inline' }}
        >
          {productDesDisplay}

          <a href="/products">go back</a>
        </div>
        <div
          style={{ display: this.state.productDesDisplay ? 'inline' : 'none' }}
        >
          <div
            style={{
              display: this.state.dis,
              flexDirection: 'column',
              width: 230
            }}
          >
            <div>
              <div>
                <select
                  id="parentdata"
                  onChange={e => this.getchildCategory(e.target.value)}
                >
                  <option disabled selected>
                    add parent category
                  </option>
                  {categoryAddOptions}
                </select>
                <select
                  id="category"
                  onChange={e => {
                    this.setState({ dropdown: e.target.value });
                  }}
                >
                  <option disabled selected>
                    add category
                  </option>
                  {childcategory}
                </select>
              </div>
              <input ref="name" />
              <label>name</label>
            </div>
            <div>
              <input ref="brand" />
              <label>brand</label>
            </div>
          </div>
          <button onClick={this.handleAdd}>add product</button>
          <button
            onClick={this.handleCancel}
            style={{ display: this.state.dis }}
          >
            cancel
          </button>
          <div
            style={{
              display: this.state.disProduct,
              width: 700,
              justifyContent: 'space-around'
            }}
          >
            <div>
              <h2>Product List</h2>

              <button
                onClick={() => {
                  this.setState({ open: true });
                }}
              >
                filterCategory
              </button>
              <div>
                <select
                  id="brand"
                  onChange={e => this.filterByBrand(e.target.value)}
                >
                  <option disabled selected value="select">
                    Filter by brand
                  </option>
                  {selectOptionBrand}
                </select>
              </div>

              <table>
                <thead>
                  <tr>
                    <th style={styles.th}>product name</th>
                  </tr>
                </thead>
                {Displayproduct}
              </table>
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

const styles = {
  td: {
    background: 'lightyellow',
    padding: 5,
    cursor: 'pointer'
  },

  th: {
    background: 'brown',
    color: 'white',
    padding: 5
  }
};

export default Product;
