<?php

namespace App\Repositories;
use App\Models\Order;

class OrderRepository{

    public function getAllOrder()
    {
        $order = Order::all();
        return $order;
    }

    public function getOrder($id)
    {
        $order = Order::where('id_order', $id)->get();
        return $order;
    }

    public function createOrder($data)
    {
        // $out = new \Symfony\Component\Console\Output\ConsoleOutput();

        // $out->writeln("---------------data-------------------");
        // $out->writeln($data);
        // $out->writeln("---------------data-------------------");
        $order = Order::create(['id_client'=> $data]);
        // $out->writeln($order);

        return $order;
    }

    public function updateOrder($id, $data)
    {
        if (Order::where('id_order', $id)->exists()) {
            $order = Order::where('id_order', $id)->update(['id_client'=> $data['id_client'], 'status'=> $data['status']]);
            return $order;
        }
        return null;
    }

    public function deleteOrder($id)
    {
        if (Order::where('id_order', $id)->exists()) {
            $order = Order::where('id_order', $id)->delete();
            return true;
        }
        return false;
    }

}
