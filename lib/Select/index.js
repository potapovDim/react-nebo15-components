import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import withStyles from 'nebo15-isomorphic-style-loader/lib/withStyles';
import { ErrorMessages } from 'react-nebo15-validate';

import Icon from '../Icon';
import OuterClick from '../OuterClick';

import styles from './styles.scss';

const LIST_HEIGHT_PADDING = 32;

const SelectControl = ({ active, placeholder, onClick }) => (
  <div onClick={() => onClick()} className={styles.control}>
    <div>
      <span
        hidden={active.title}
        className={styles.placeholder}
      >
        {placeholder}
      </span>
      <span hidden={!active.title}>
        {active && active.title}
      </span>
    </div>
  </div>
);

class Select extends React.Component {
  static propTypes = {
    active: PropTypes.oneOfType([
      PropTypes.number,
      PropTypes.string,
    ]),
    labelText: PropTypes.string,
    open: PropTypes.bool,
    disabled: PropTypes.bool,
    placeholder: PropTypes.string,
    options: PropTypes.arrayOf(
      PropTypes.shape({
        title: PropTypes.string.isRequired, // eslint-disable-line react/no-unused-prop-types
        name: PropTypes.string.isRequired, // eslint-disable-line react/no-unused-prop-types
        disabled: PropTypes.bool, // eslint-disable-line react/no-unused-prop-types
      })
    ).isRequired,
    onChange: PropTypes.func,
  };

  static defaultProps = {
    open: false,
    onToggle: () => {},
  };

  state = {
    open: this.props.open,
    active: (() => this.props.options.filter(item => item.name === this.props.active)[0])(),
  };

  componentWillReceiveProps(props) {
    (props.open !== this.props.open) && this.setState({ open: props.open });

    if (props.active) {
      this.setState({
        active: this.props.options.filter(item => item.name === props.active)[0],
      });
    }
  }

  onSelect(item = {}) {
    this.setState({ active: item });
    this.toggle(false);
    this.props.onChange && this.props.onChange(item.name);
  }

  /**
   * Calculate open drop down popup position
   * @returns {String<'top'|'bottom'>}
   */
  get position() {
    if (!this.selectNode) {
      return 'bottom';
    }

    const selectSize = this.selectNode.getBoundingClientRect();
    const screenHeight = document.documentElement.clientHeight;
    const selectHeight = this.listNode.clientHeight;

    if (screenHeight - selectSize.bottom > selectHeight + LIST_HEIGHT_PADDING) {
      return 'bottom';
    }

    return 'top';
  }

  get value() {
    return this.state.active;
  }

  toggle(open = !this.state.open) {
    this.setState({ open });
    this.props.onToggle(open);
  }

  /* eslint-disable jsx-a11y/no-static-element-interactions */
  render() {
    const {
      options = [],
      placeholder,
      disabled,
      labelText,
      error,
      children,
      controlComponent = SelectControl,
      controlProps = {},
      filter = item => item,
    } = this.props;

    const items = options.filter(filter);
    let empty = false;

    if (items.length === 0) {
      items.push(this.props.emptyText);
      empty = true;
    }

    const activeItem = this.state.active || {};
    const classNames = classnames(
      styles.select,
      this.state.open && styles[this.position],
      this.state.open && styles.open,
      disabled && styles.disabled,
      error && styles.error
    );

    const controlElementSelect = React.createElement(controlComponent, {
      onClick: () => this.toggle(),
      placeholder,
      active: activeItem,
      ...controlProps,
    });


    return (
      <section ref={ref => (this.selectNode = ref)} className={classNames}>
        <div className={styles.label}>{labelText}</div>
        <OuterClick
          onClick={() => this.toggle(false)}
        >
          <div>
            <div className={styles.wrap}>
              {controlElementSelect}
              { error &&
              <div className={styles['error-label']}>
                { typeof error === 'string' ? error : <ErrorMessages error={error}>{children}</ErrorMessages> }
              </div>
              }
              <span className={styles.arrow} />
            </div>
            <ul ref={ref => (this.listNode = ref)} className={styles.list}>
              {
                !empty && items
                  .map(item => (
                    <li
                      onClick={() => !item.disabled && this.onSelect(item)}
                      className={classnames(
                        item.name === activeItem.name && styles.active,
                        item.disabled && styles.disabled
                      )}
                      data-select-name={item.name}
                      key={item.name}
                    >
                      {item.title}
                      {item.name === activeItem.name && <span className={styles.icon}><Icon name="check-right" /></span>}
                    </li>
                  ))
              }
              {
                empty && items
                  .map(item => (
                    <li className={styles.disabled} key={item}>
                      {item}
                    </li>
                  ))
              }
            </ul>
          </div>
        </OuterClick>
      </section>
    );
  }
}

export default withStyles(styles)(Select);
