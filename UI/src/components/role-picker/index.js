import React, { Component } from 'react'
import { connect } from 'react-redux'
import superagent from 'superagent'
import * as Actions from './actions'
import './RolePicker.sass'

import Role from '../role'

const mapState = ({ rolePicker, servers }, ownProps) => {
  return {
    data: rolePicker,
    server: servers.get(ownProps.match.params.server)
  }
}

@connect(mapState)
class RolePicker extends Component {
  componentWillMount () {
    const { dispatch, match: { params: { server } } } = this.props
    dispatch(Actions.setup(server))
  }

  componentWillReceiveProps (nextProps) {
    if (this.props.match.params.server !== nextProps.match.params.server) {
      const { dispatch } = this.props
      dispatch(Actions.setup(nextProps.match.params.server))
    }
  }

  isSelected (id) {
    return this.props.data.getIn([ 'rolesSelected', id ])
  }

  render () {
    const { data, server } = this.props
    const vm = data.get('viewMap') 

    if (server === undefined) {
      return null
    }

    return <div className={`role-picker ${(data.get('hidden')) ? 'hidden' : ''}`}>
      { (server.get('message') !== '')
        ? <section>
            <h3>Server Message</h3>
            <p>{server.get('message')}</p>
          </section>
        : null
      }
      <section>
        <h3>Roles</h3>
        <div className="role-picker__categories">
          {
            vm.map((c, name) => {
              if (c.get('hidden')) {
                return null
              }

              return <div key={name} className="role-picker__category">
                <h4>{ name }</h4>
                {
                  c.get('roles_map').map((r, k) => {
                    return <Role key={k} role={r} selected={this.isSelected(r.get('id'))} onToggle={() => this.props.dispatch(Actions.roleUpdate(r.get('id'), this.isSelected(r.get('id'))))} />
                  }).toArray()
                }
              </div>
            }).toArray()
          }
        </div>
      </section>
    </div>
  }
}

export default RolePicker
