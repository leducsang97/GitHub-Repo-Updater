import React from 'react';
import { makeStyles } from '@material-ui/core';
import { SearchRepo, LocalRepo } from './pages';

import './App.css';

const useStyles = makeStyles({
	root: {
		padding: '16px'
	},
	searchComponent: {
		marginBottom: '16px'
	}
});

const App = () => {
	const classes = useStyles();
	return (
		<div className={classes.root}>
			{/* Search tab */}
			<div className={classes.searchComponent}>
				<SearchRepo />
			</div>
			{/* Existed tab */}
			<div className={classes.existedComponent}>
				<LocalRepo />
			</div>
		</div>
	);
};

export default App;
