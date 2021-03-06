import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { translate } from 'react-i18next';
import CSSModules from 'react-css-modules';

export default function WrapComponent() {
	const connectReturn = connect.apply(this, arguments);

	return function wrap(component, css){
		/*
		class ErrorHandlerComponent extends component {
			constructor( props, context ){
				super( props, context );
			}
			
			render(){
				try{
					return super.render();
				}catch(e){
					e.stack = e.stack.replace(/WrappedComponent/, component.name);
					throw e;
				}
			}
		};
		*/
		const vewCss = CSSModules(component, css, { allowMultiple : true });
		const viewTranslate = translate([])(vewCss);
		return connectReturn(viewTranslate);
	};
};

export const mapping = (func) => (reducing) => (result, input) => reducing(result, func(input));
export const filtering = (test) => (reducing) => (result, input) => test(input) ? reducing(result, input) : result;