<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Http\Resources\ProductsResource;
use App\Http\Resources\ProductsCollection;
use App\Http\Requests\StoreProductsRequest;
use App\Models\Products;
use App\Models\Categories;
use App\Models\User;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Auth;
use App\Helpers\FileUploader;
use App\Traits\ApiResponseTrait;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\DB;

class ProductsController extends Controller
{

    use ApiResponseTrait;

    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        $products = Products::all();
        // $products = Products::with('Categories')->get();
        return self::apiResponseSuccess(new ProductsCollection($products), 'Datos de productos', Response::HTTP_OK);
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */

    public function store(StoreProductsRequest $request)
    {
        /* if (Gate::allows('isGerente')) { */
            $categories = Categories::find($request['categories_id']);

            $data = $request->all();
            if (isset($request['image'])) {
                if ($request['image'] != null && $request['image'] != '' && !is_string($request['image'])) {
                    $data['image'] = FileUploader::store($request['image'], $request['name'], 'gallery/products');
                }
            }

            $product = new Products($data);
            $categories->products()->save($product);
            return $product;
        /* } else {
            return self::apiResponseError(null, 'Unauthorized' , response::HTTP_FORBIDDEN);
        } */
    }



    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        return ProductsResource::make(Products::with('Categories')->where('id', $id)->firstOrFail());
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function edit($id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
        /* if (Gate::allows('isGerente')) { */
            $user = Auth::user();
            $products = Products::find($id);

            if (Products::where('id', $id)->exists()) {
                $product = Products::find($id);

                $data = $request->all();
                if (isset($request['image'])) {
                    if ($request['image'] != null && $request['image'] != '' && !is_string($request['image'])) {
                        $data['image'] = FileUploader::update($request['image'], $request['name'], 'gallery/products', $product->image);
                    }
                }

                $product->name = $request->name;
                $product->description = $request->description;
                $product->categories_id = $request->categories_id;
                $product->price = $request->price;
                $product->image = $data['image'];
                $product->save();

                $product = Products::where('id', $id)->firstOrFail();

                return self::apiResponseSuccess($product, 'Producto actualizado', Response::HTTP_OK);
            } else {
                return response()->json([
                    "message" => "Product not found"
                ], 404);
            }
       /*  } else {
            return self::apiResponseError(null, 'Unauthorized' , response::HTTP_FORBIDDEN);
        } */
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
       /*  if (Gate::allows('isGerente')) { */
            $product = Products::find($id);

            if ($product) {
                FileUploader::delete($product['image']);
                $product->delete();
                return self::apiResponseSuccess(null, 'OK', Response::HTTP_OK);
            }
            return self::apiResponseError(null, 'Producto no encontrado', Response::HTTP_NOT_FOUND);
        /* } else {
            return self::apiResponseError(null, 'Unauthorized' , response::HTTP_FORBIDDEN);
        } */
    }

    public function getChart(Request $request)
    {
        /* if (Gate::allows('isGerente')) { */
            $products = DB::table('categories')->select('categories.name', DB::raw('count(*) as count'))
                        ->join('products', 'products.categories_id', '=', 'categories.id')
                        ->groupBy('categories.name','categories.id')->get();
            $products->toJson();
            
            return self::apiResponseSuccess($products, 'Datos de productos', Response::HTTP_OK);
      /*   } else {
            return self::apiResponseError(null, 'Unauthorized' , response::HTTP_FORBIDDEN);
        } */
    }
}
