import React from 'react';
import auth from '../../controller/auth';
import utils from '../../controller/utils';
import routeHandler from '../../controller/routeHandler';

const EmailConfirmed = () => {
  utils.lockScroller(true);
  return (
    <div className={"modal-full show"}>
      <div className="modal-dialog">
        <h1 className="modal-title">Email Confirmed</h1>
        <p className="center">Your email has been confirmed.
          {!auth.hasLocalToken() && 'Log in to explore Project Fuse.'}</p>
        <div className="modal-one-btn">
          <button className="yes one" onClick={() => {
            utils.lockScroller(false);
            routeHandler.redirectTo('/');
          }}>OK
          </button>
        </div>
      </div>
    </div>
  )
};

export default EmailConfirmed;
