import React from 'react';

const CheckMark: React.FC = () => {
  return (
    <svg width="20px" height="15px" viewBox="0 0 20 15">
      <defs>
        <polygon id="path-1" points="865.315518 299.991044 856 290.492514 858.495974 288 870.25 299.984945 863.403736 307 860.901718 304.513664" />
      </defs>
      <g stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
        <g transform="translate(-853.000000, -290.000000)">
          <mask fill="white">
            <use href="#path-1" />
          </mask>
          <use fill="#000" fillRule="nonzero" transform="translate(863.125000, 297.500000) rotate(90.000000) translate(-863.125000, -297.500000) " xlinkHref="#path-1" />
        </g>
      </g>
    </svg>
  );
};

export default CheckMark;
