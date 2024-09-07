type RowType = {
  content: {
    title: string;
    ul: string[];
    url: string;
    button_content: string;
    image: string;
  };
  isEven?: boolean;
};

export const Row = ({ content, isEven = false }: RowType) => {
  return (
    <div className="rounded-3xl mb-10 flex items-center justify-between p-10 bg-secondary border border-borderColor-DARK shadow-xl w-full overflow-hidden relative z-10">
      {isEven ? (
        <div className="p-5">
          <img
            src={content.image}
            className="min-w-[500px] object-cover h-[300px] shadow-2xl shadow-[rgba(0,0,0,0.3)] border border-borderColor rounded-xl"
          />
        </div>
      ) : null}

      <div className={isEven ? "ml-[50px]" : "mr-[50px]"}>
        <h4 className="text-white font-bold text-3xl mb-2">{content.title}</h4>
        <ul className="text-font-60 text-lg mt-5">
          {content.ul.map((text, i) => (
            <li className={`flex items-center ${i === 1 ? "my-2" : ""}`}>
              <div className="h-1.5 w-1.5 min-w-1.5 mr-2 rounded-full bg-white" />
              {text}
            </li>
          ))}
        </ul>
        <button className="text-base_color font-medium cursor-not-allowed text-lg mt-[30px]">
          {/* <Link href={content.url}> */}
          {content.button_content}
          {/* </Link> */}
        </button>
      </div>
      {!isEven ? (
        <div className="p-5">
          <img
            src={content.image}
            className="min-w-[500px] object-cover h-[300px] shadow-2xl shadow-[rgba(0,0,0,0.3)] border border-borderColor rounded-xl"
          />
        </div>
      ) : null}
    </div>
  );
};
