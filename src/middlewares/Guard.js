import { container } from '../services/container';
 
export default {

	auth (to, from, next) {

        next(container.get('user') ? true : {
            name: 'sign-in'
        });
    }
}