import React, { useState, useEffect, useContext } from 'react';

import { HomeStackNavigator, AuthStackNavigator } from './screens/routes.js';

import { AuthContext, AuthContextProvider } from './AuthContext.js';

import Root from './Root.js';

export default function App() {
	return (
		<>
			<AuthContextProvider>
				<Root />
			</AuthContextProvider>
		</>
	);
}