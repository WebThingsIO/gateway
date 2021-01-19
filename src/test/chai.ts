/**
 * Module to group together our chai use and plugins.
 */
import chai from 'chai';
import chaiHttp from 'chai-http';

chai.use(chaiHttp);

export default chai;
