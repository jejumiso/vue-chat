import { commonNotAuth } from './index';

//메인 베스트 bj불러오기
function fetchBjRakingForMain() {
	return commonNotAuth.get('/v2/members_bj');
}

export { fetchBjRakingForMain };
