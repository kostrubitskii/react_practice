/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/accessible-emoji */
import React, { useState } from 'react';
import './App.scss';
import cn from 'classnames';

import usersFromServer from './api/users';
import categoriesFromServer from './api/categories';
import productsFromServer from './api/products';

const products = productsFromServer.map((product) => {
  const category = categoriesFromServer.find(
    cat => cat.id === product.categoryId,
  );
  const user = usersFromServer.find(person => person.id === category.ownerId);

  return {
    category,
    user,
    ...product,
  };
});

export const App = () => {
  const [selectedUser, setSelectedUser] = useState('All');
  const [inputValue, setInputValue] = useState('');
  const [selectedCategory, setSelectedCategory] = useState([]);
  // const [sortBy, setSortBy] = useState(null);
  // const [columnSort, setColumnSort] = useState('');

  // const testFunction = () => {
  //   const test = [...filterProducts];

  //   if (sortBy !== null) {
  //     test.sort((a, b) => {
  //       if (sortBy === null) {
  //         return 0;
  //       }

  //       return sortBy === true
  //         ? a[columnSort] - b[columnSort]
  //         : b[columnSort] - a[columnSort];
  //     });
  //   }

  //   return test;
  // };

  const resetButton = () => {
    setSelectedUser('All');
    setInputValue('');
    setSelectedCategory([]);
  };

  // const sorting = (name) => {
  //   setSortBy(pastValue => !pastValue);
  //   setColumnSort(name);
  // };

  const filterProducts = products
    .filter(product => (
      selectedUser !== 'All' ? selectedUser === product.user.name : true
    ))
    .filter(product => product.name
      .toLowerCase()
      .includes(inputValue.toLowerCase()))
    .filter(product => (selectedCategory.length !== 0
      ? selectedCategory.includes(product.category.id)
      : true));

  return (
    <div className="section">
      <div className="container">
        <h1 className="title">Product Categories</h1>

        <div className="block">
          <nav className="panel">
            <p className="panel-heading">Filters</p>

            <p className="panel-tabs has-text-weight-bold">
              <a
                data-cy="FilterAllUsers"
                href="#/"
                onClick={() => setSelectedUser('All')}
                className={cn(selectedUser === 'All' ? 'is-active' : '')}
              >
                All
              </a>

              {usersFromServer.map(user => (
                <a
                  data-cy="FilterAllUsers"
                  href="#/"
                  onClick={() => setSelectedUser(user.name)}
                  className={cn(selectedUser === user.name ? 'is-active' : '')}
                >
                  {user.name}
                </a>
              ))}
            </p>

            <div className="panel-block">
              <p className="control has-icons-left has-icons-right">
                <input
                  data-cy="SearchField"
                  type="text"
                  className="input"
                  placeholder="Search"
                  onChange={event => setInputValue(event.target.value)}
                  value={inputValue}
                />

                <span className="icon is-left">
                  <i className="fas fa-search" aria-hidden="true" />
                </span>
                {inputValue && (
                <span className="icon is-right">
                  {/* eslint-disable-next-line jsx-a11y/control-has-associated-label */}
                  <button
                    data-cy="ClearButton"
                    type="button"
                    className="delete"
                    onClick={() => setInputValue('')}
                  />
                </span>
                )}

              </p>
            </div>

            <div className="panel-block is-flex-wrap-wrap">
              <a
                href="#/"
                data-cy="AllCategories"
                className={cn('button is-success mr-6',
                  { 'is-outlined': selectedCategory.length !== 0 })}
                onClick={() => setSelectedCategory([])}
              >
                All
              </a>
              {categoriesFromServer.map(category => (
                <a
                  data-cy="Category"
                  href="#/"
                  onClick={() => setSelectedCategory(
                    pastValue => [...pastValue, category.id],
                  )}
                  className={cn('button mr-2 my-1',
                    { 'is-info': selectedCategory.includes(category.id) })}
                >
                  {category.title}
                </a>
              ))}
            </div>

            <div className="panel-block">
              <a
                onClick={resetButton}
                data-cy="ResetAllButton"
                href="#/"
                className="button is-link is-outlined is-fullwidth"
              >
                Reset all filters
              </a>
            </div>
          </nav>
        </div>

        <div className="box table-container">
          {filterProducts.length === 0
            ? (
              <p data-cy="NoMatchingMessage">
                No products matching selected criteria
              </p>
            )
            : (
              <table
                data-cy="ProductTable"
                className="table is-striped is-narrow is-fullwidth"
              >
                <thead>
                  <tr>
                    <th>
                      <span className="is-flex is-flex-wrap-nowrap">
                        ID

                        <a href="#/">
                          <span className="icon">
                            <i
                              // onClick={() => sorting('id')}
                              data-cy="SortIcon"
                              className="fas fa-sort"
                            />
                          </span>
                        </a>
                      </span>
                    </th>

                    <th>
                      <span className="is-flex is-flex-wrap-nowrap">
                        Product

                        <a href="#/">
                          <span className="icon">
                            <i
                              data-cy="SortIcon"
                              className="fas fa-sort-down"
                            />
                          </span>
                        </a>
                      </span>
                    </th>

                    <th>
                      <span className="is-flex is-flex-wrap-nowrap">
                        Category

                        <a href="#/">
                          <span className="icon">
                            <i data-cy="SortIcon" className="fas fa-sort-up" />
                          </span>
                        </a>
                      </span>
                    </th>

                    <th>
                      <span className="is-flex is-flex-wrap-nowrap">
                        User

                        <a href="#/">
                          <span className="icon">
                            <i data-cy="SortIcon" className="fas fa-sort" />
                          </span>
                        </a>
                      </span>
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {filterProducts.map(product => (
                    <tr data-cy="Product" key={product.id}>
                      <td className="has-text-weight-bold" data-cy="ProductId">
                        {product.id}
                      </td>

                      <td data-cy="ProductName">{product.name}</td>
                      <td data-cy="ProductCategory">
                        {`${product.category.icon} - ${product.category.title}`}
                      </td>

                      <td
                        data-cy="ProductUser"
                        className={cn(product.user.sex === 'm'
                          ? 'has-text-link'
                          : 'has-text-danger')}
                      >
                        {product.user.name}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )
        }
        </div>
      </div>
    </div>
  );
};
