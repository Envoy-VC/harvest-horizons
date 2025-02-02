export const Inventory = () => {
  //   const { inventory } = usePlayer();
  return (
    <div className='flex flex-col gap-6 pt-4'>
      <div className='px-6 font-black font-minecraftia text-3xl'>Inventory</div>
      <div className='flex flex-row flex-wrap items-center gap-4'>
        {/* {inventory.map((item) => {
          const name = item.itemId
            .split('_')
            .map((word) => {
              let res = word;
              if (word.endsWith('es')) {
                res = word.slice(0, -2);
              }
              if (word.endsWith('s')) {
                res = word.slice(0, -1);
              }
              // Capitalize first letter
              return res.charAt(0).toUpperCase() + res.slice(1);
            })
            .join(' ');
          return (
            <div
              key={item.id}
              className='flex aspect-square w-full max-w-[160px] flex-col items-center gap-2 rounded-md border-3 border-[#6B5052] p-2'
            >
              <img
                alt={item.itemId}
                className='h-16 w-16 object-cover'
                src={`/ui/${item.itemId}.png`}
              />
              <div className='font-black font-minecraftia text-base'>
                x{item.quantity}
              </div>
              <div className='break-words font-black font-minecraftia text-base'>
                {name}
              </div>
            </div>
          );
        })} */}
      </div>
    </div>
  );
};
