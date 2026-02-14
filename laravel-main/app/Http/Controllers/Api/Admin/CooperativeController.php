<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Cooperative;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class CooperativeController extends Controller
{
    public function index()
    {
        try {
            $cooperatives = Cooperative::orderBy('created_at', 'desc')->get();
            
            return response()->json([
                'success' => true,
                'data' => $cooperatives,
                'count' => $cooperatives->count()
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error fetching cooperatives: ' . $e->getMessage()
            ], 500);
        }
    }

    public function store(Request $request)
    {
        try {
            $validator = Validator::make($request->all(), [
                'nom' => 'required|string|max:255',
                'email' => 'required|email|unique:cooperatives,email',
                'description' => 'nullable|string',
                'adresse' => 'nullable|string',
                'image' => 'nullable|image|mimes:jpg,jpeg,png|max:2048',
                'contact' => 'nullable|string',
                'tele' => 'nullable|string',
                'instagram' => 'nullable|string',
                'facebook' => 'nullable|string',
                'whatsapp' => 'nullable|string',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Validation error',
                    'errors' => $validator->errors()
                ], 422);
            }

            $imagePath = null;
            if ($request->hasFile('image')) {
                $image = $request->file('image');
                $imageName = time() . '_' . uniqid() . '.' . $image->getClientOriginalExtension();
                $image->move(public_path('uploads/cooperatives'), $imageName);
                $imagePath = 'uploads/cooperatives/' . $imageName;
            }

            $cooperative = Cooperative::create([
                'nom' => $request->nom,
                'email' => $request->email,
                'description' => $request->description,
                'adresse' => $request->adresse,
                'image' => $imagePath,
                'contact' => $request->contact,
                'tele' => $request->tele,
                'instagram' => $request->instagram,
                'facebook' => $request->facebook,
                'whatsapp' => $request->whatsapp,
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Cooperative created successfully',
                'data' => $cooperative
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error creating cooperative: ' . $e->getMessage()
            ], 500);
        }
    }

    public function show($id)
    {
        try {
            $cooperative = Cooperative::findOrFail($id);
            
            return response()->json([
                'success' => true,
                'data' => $cooperative
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Cooperative not found'
            ], 404);
        }
    }

    public function update(Request $request, $id)
    {
        try {
            $cooperative = Cooperative::findOrFail($id);

            $validator = Validator::make($request->all(), [
                'nom' => 'sometimes|string|max:255',
                'email' => 'sometimes|email|unique:cooperatives,email,' . $id,
                'description' => 'nullable|string',
                'adresse' => 'nullable|string',
                'image' => 'nullable|image|mimes:jpg,jpeg,png|max:2048',
                'contact' => 'nullable|string',
                'tele' => 'nullable|string',
                'instagram' => 'nullable|string',
                'facebook' => 'nullable|string',
                'whatsapp' => 'nullable|string',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Validation error',
                    'errors' => $validator->errors()
                ], 422);
            }

            // Handle image upload if present
            if ($request->hasFile('image')) {
                // Delete old image if exists
                if ($cooperative->image && file_exists(public_path('uploads/cooperatives/' . basename($cooperative->image)))) {
                    unlink(public_path('uploads/cooperatives/' . basename($cooperative->image)));
                }
                
                $image = $request->file('image');
                $imageName = time() . '_' . uniqid() . '.' . $image->getClientOriginalExtension();
                $image->move(public_path('uploads/cooperatives'), $imageName);
                $cooperative->image = 'uploads/cooperatives/' . $imageName;
            }

            // Update other fields
            $cooperative->update($request->except(['image', '_method']));

            return response()->json([
                'success' => true,
                'message' => 'Cooperative updated successfully',
                'data' => $cooperative
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error updating cooperative: ' . $e->getMessage()
            ], 500);
        }
    }

    public function destroy($id)
    {
        try {
            $cooperative = Cooperative::findOrFail($id);
            
            // Delete image if exists
            if ($cooperative->image && file_exists(public_path('uploads/cooperatives/' . basename($cooperative->image)))) {
                unlink(public_path('uploads/cooperatives/' . basename($cooperative->image)));
            }
            
            $cooperative->delete();

            return response()->json([
                'success' => true,
                'message' => 'Cooperative deleted successfully'
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error deleting cooperative: ' . $e->getMessage()
            ], 500);
        }
    }
}
