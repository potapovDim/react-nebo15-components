import { expect } from 'chai';
import { jsdom } from 'jsdom';
import register from 'ignore-styles';
import React from 'react'
register(['.sass', '.scss', '.css']);

const exposedProperties = ['window', 'navigator', 'document'];

global.React = React;
global.document = jsdom('');
global.window = document.defaultView;
Object.keys(document.defaultView).forEach((property) => {
  if (typeof global[property] === 'undefined') {
    exposedProperties.push(property);
    global[property] = document.defaultView[property];
  }
});

global.navigator = {
  userAgent: 'node.js'
};

global.documentRef = document;
global.expect = expect;

hook({
  generateScopedName: '[name]__[local]___[hash:base64:5]',
  extensions: ['.sass', '.scss', '.css'],
});
