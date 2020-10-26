import { useSelector } from 'react-redux';
import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core';
import LocalRepoDisplay from './localRepoDisplay';

const useStyles = makeStyles({
	root: {
		width: '100%',
		height: '100%'
	},
	body: {
		width: '100%'
	}
});

export const LocalRepo = () => {
	const [listRepo, setlistRepo] = useState([]);
	const classes = useStyles();
	//manual reload because localStorage will not trigger refresh
	const [reload, setReload] = useState(true);
	const newChange = useSelector(state => state.newChange);

	useEffect(() => {
		let localSavedRepo = JSON.parse(localStorage.getItem('LocalSavedRepo')) || {};
		let listRepoProcessing = [];
		for (let key in localSavedRepo) {
			let [repo, owner] = key.split('/');
			let repoData = { ...localSavedRepo[key], repo: repo, owner: owner };
			listRepoProcessing.push(repoData);
		}
		setlistRepo(listRepoProcessing);
	}, [reload, newChange]);

	const removeRepo = (repo, owner) => {
		console.log(`Remove ${repo} from ${owner}`);
		let localSavedRepo = JSON.parse(localStorage.getItem('LocalSavedRepo'));
		let nameOfRepo = repo + '/' + owner;

		//delete the repo
		delete localSavedRepo[nameOfRepo];
		localStorage.setItem('LocalSavedRepo', JSON.stringify(localSavedRepo));
		console.log('removed');
		setReload(!reload);
	};

	const setSeen = (repo, owner) => {
		let localSavedRepo = JSON.parse(localStorage.getItem('LocalSavedRepo'));
		let nameOfRepo = repo + '/' + owner;

		//set the repo seen
		localSavedRepo[nameOfRepo].seen = true;
		localStorage.setItem('LocalSavedRepo', JSON.stringify(localSavedRepo));
		console.log('seen');
		setReload(!reload);
	};

	return (
		<div className={classes.root}>
			<div className={classes.body}>
				<LocalRepoDisplay listRepo={listRepo} removeRepo={removeRepo} setSeen={setSeen} />
			</div>
		</div>
	);
};

export default React.memo(LocalRepo);
