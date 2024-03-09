/**
 * WordPress dependencies
 */
import { useState } from "@wordpress/element";

/**
 * Internal dependencies
 */
import DisplayPost from "./DisplayPost";
import ListWithAnimation from "../ListWithAnimation";

const DisplayDay = ({ dayObj }) => {
  const [expand, setExpand] = useState(false);

  const loadPosts = async (event) => {
    event.preventDefault();
    setExpand(!expand);
  };

  return (
    <ListWithAnimation
      items={dayObj.posts}
      link={{
        content: dayObj.title,
        href: "#",
        title: dayObj.title,
        onClick: loadPosts,
      }}
      expand={expand}
      initialExpand={dayObj.expand}
      loading={false}
      rootLink={{
        ...dayObj,
        title: dayObj.title,
        onClick: loadPosts,
      }}
      showToggleSymbol={true}
      subListCustomClass="posts"
    >
      {(item) => (
        <li key={item.ID}>
          <DisplayPost post={item} />
        </li>
      )}
    </ListWithAnimation>
  );
};

export default DisplayDay;
