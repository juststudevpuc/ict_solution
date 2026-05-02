import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { forwardRef } from "react";
import logo from "@/assets/logo.png";
import { useSelector } from "react-redux";


const InvoiceCard = forwardRef((props, ref) => {
  const cart = useSelector((state) => state.cart);

  const tbl_head = [
    "No",
    "Name",
    "Description",
    // "Brand",
    // "Category",
    "Qty",
    "Price",
    "Discount",
    "Image",
    "Status",
  ];

  return (
    <div ref={ref} className="bg-white text-black">
      <div className="p-8 space-y-6">

        {/* ===== HEADER ===== */}
        <div className="flex justify-between items-center border-b pb-4">
          <div>
            <h1 className="text-xl font-bold">INVOICE</h1>
            <p className="text-sm text-gray-600">
              Invoice No: {Date.now()}
            </p>
            <p className="text-sm text-gray-600">
              Date: {new Date().toLocaleDateString()}
            </p>
          </div>

          <div className="w-20 h-20 rounded-full overflow-hidden border">
            <img
              className="w-full h-full object-cover"
              src={logo}
              alt="Logo"
            />
          </div>
        </div>

        {/* ===== TABLE ===== */}
        <div className="border rounded-lg overflow-hidden">
          <Table>
            <TableHeader className="bg-gray-100">
              <TableRow>
                {tbl_head.map((item, index) => (
                  <TableHead
                    key={index}
                    className="text-xs font-semibold text-gray-700"
                  >
                    {item}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>

            <TableBody>
              {Array.isArray(cart) && cart.length ? (
                cart.map((item, index) => (
                  <TableRow
                    key={index}
                    className="hover:bg-gray-50 text-sm"
                  >
                    <TableCell>{index + 1}</TableCell>
                    <TableCell className="font-medium">
                      {item?.name}
                    </TableCell>
                    <TableCell className="text-gray-600">
                      {item?.description}
                    </TableCell>
                    {/* <TableCell>{item?.brand?.name}</TableCell> */}
                    {/* <TableCell>{item?.category?.name}</TableCell> */}
                    <TableCell className="text-center">
                      {item?.qty}
                    </TableCell>
                    <TableCell>${item?.price}</TableCell>
                    <TableCell>{item?.discount}%</TableCell>

                    <TableCell>
                      {item?.image ? (
                        <div className="w-16 h-16 rounded-md overflow-hidden border">
                          <img
                            className="w-full h-full object-cover"
                            src={item?.image_url}
                            alt={item?.name}
                          />
                        </div>
                      ) : (
                        <div className="w-16 h-16 flex items-center justify-center bg-gray-200 rounded-md text-xs text-gray-500">
                          No Image
                        </div>
                      )}
                    </TableCell>

                    <TableCell>
                      {item?.status ? (
                        <Badge className="bg-green-600 text-white">
                          Active
                        </Badge>
                      ) : (
                        <Badge variant="destructive">
                          Inactive
                        </Badge>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={13}>
                    <div className="py-10 text-center text-gray-500">
                      No data
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        {/* ===== FOOTER ===== */}
        <div className="text-center text-sm text-gray-500 pt-4 border-t">
          Thank you for your purchase
        </div>

      </div>
    </div>
  );
});

export default InvoiceCard;
