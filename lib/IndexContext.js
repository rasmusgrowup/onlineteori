import React, {useState} from 'react';

export const IndexContext = React.createContext();

export const IndexProvider = (props) => {
  const [index, setIndex] = useState(1);
  return (
    <IndexContext.Provider value={[index, setIndex]}>
      {props.children}
    </IndexContext.Provider>
  )
}
