import { AuthContextProvider } from './AuthContext.js';

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